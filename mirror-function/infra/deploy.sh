#!/usr/bin/env bash
#
# Uniform edge mirror — pure az CLI deployment.
#
# Provisions (or updates) all Azure resources needed to run the mirror
# Function and exposes the static-API base URL the Next.js app will read from.
# No Bicep, no ARM templates — just `az` commands + `func` for code publish.
#
# Usage:
#   ./infra/deploy.sh \
#       --resource-group  <rg-name> \
#       --location        <region> \
#       --name-prefix     <prefix> \
#       --uniform-project-id <id> \
#       --uniform-api-key <key> \
#       [--allow-anonymous-blob true|false]      # default: true (public blob read)
#       [--rate-limit-rps N]                     # default: 5
#       [--dynamic-expansions '<json>']          # default: {"location":"location"}
#       [--locale-prefixes '<json-array>']       # default: ["en"]
#       [--seed-cron '<ncrontab>']               # default: "0 0 */6 * * *"
#       [--no-publish]                           # provision only; skip func publish
#
# All flags can also be supplied via env vars (uppercase with underscores).
#
# Prereqs:
#   * az CLI signed in to the right subscription (az login + az account set)
#   * Azure Functions Core Tools v4 (`func --version | grep ^4`)
#   * Node 22 + npm
#
# Idempotent — re-running with the same inputs converges to the same state.

set -euo pipefail

# ---------------------------------------------------------------------------
# Argument parsing
# ---------------------------------------------------------------------------
RESOURCE_GROUP="${RESOURCE_GROUP:-}"
LOCATION="${LOCATION:-eastus}"
NAME_PREFIX="${NAME_PREFIX:-pfgmirror}"
UNIFORM_PROJECT_ID="${UNIFORM_PROJECT_ID:-}"
UNIFORM_API_KEY="${UNIFORM_API_KEY:-}"
UNIFORM_API_BASE="${UNIFORM_API_BASE:-https://uniform.global}"
UNIFORM_APP_BASE="${UNIFORM_APP_BASE:-https://uniform.app}"
ALLOW_ANONYMOUS_BLOB="${ALLOW_ANONYMOUS_BLOB:-true}"
RATE_LIMIT_RPS="${RATE_LIMIT_RPS:-5}"
DYNAMIC_EXPANSIONS="${DYNAMIC_EXPANSIONS:-{\"location\":\"location\"}}"
LOCALE_PREFIXES="${LOCALE_PREFIXES:-[\"en\"]}"
SEED_CRON="${SEED_CRON:-0 0 */6 * * *}"
DO_PUBLISH=true

while [[ $# -gt 0 ]]; do
  case "$1" in
    --resource-group)            RESOURCE_GROUP="$2"; shift 2 ;;
    --location)                  LOCATION="$2"; shift 2 ;;
    --name-prefix)               NAME_PREFIX="$2"; shift 2 ;;
    --uniform-project-id)        UNIFORM_PROJECT_ID="$2"; shift 2 ;;
    --uniform-api-key)           UNIFORM_API_KEY="$2"; shift 2 ;;
    --uniform-api-base)          UNIFORM_API_BASE="$2"; shift 2 ;;
    --uniform-app-base)          UNIFORM_APP_BASE="$2"; shift 2 ;;
    --allow-anonymous-blob)      ALLOW_ANONYMOUS_BLOB="$2"; shift 2 ;;
    --rate-limit-rps)            RATE_LIMIT_RPS="$2"; shift 2 ;;
    --dynamic-expansions)        DYNAMIC_EXPANSIONS="$2"; shift 2 ;;
    --locale-prefixes)           LOCALE_PREFIXES="$2"; shift 2 ;;
    --seed-cron)                 SEED_CRON="$2"; shift 2 ;;
    --no-publish)                DO_PUBLISH=false; shift ;;
    *) echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

require() {
  if [[ -z "${!1:-}" ]]; then
    echo "Missing required value: $1" >&2
    exit 1
  fi
}

require RESOURCE_GROUP
require UNIFORM_PROJECT_ID
require UNIFORM_API_KEY

# Derived resource names. The storage account name must be globally unique,
# all-lowercase, 3-24 chars. We append a stable hash of the RG to avoid
# collisions when the same prefix is reused across subscriptions.
HASH="$(echo -n "${RESOURCE_GROUP}" | shasum -a 256 | cut -c1-6)"
STORAGE_ACCOUNT="$(echo -n "${NAME_PREFIX}st${HASH}" | tr '[:upper:]' '[:lower:]' | cut -c1-24)"
FUNCTION_APP="${NAME_PREFIX}-fn"
APP_INSIGHTS="${NAME_PREFIX}-ai"
LOG_WORKSPACE="${NAME_PREFIX}-logs"
BLOB_CONTAINER="edge-mirror"
TABLE_BY_TAG="byTag"

# Function source root (this script lives in mirror-function/infra/).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FUNCTION_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "==============================================================="
echo "  Resource group:   ${RESOURCE_GROUP}"
echo "  Location:         ${LOCATION}"
echo "  Name prefix:      ${NAME_PREFIX}"
echo "  Storage account:  ${STORAGE_ACCOUNT}"
echo "  Function app:     ${FUNCTION_APP}"
echo "  App Insights:     ${APP_INSIGHTS}"
echo "  Log workspace:    ${LOG_WORKSPACE}"
echo "==============================================================="

# ---------------------------------------------------------------------------
# Resource group
# ---------------------------------------------------------------------------
echo "==> Ensuring resource group exists"
az group create \
  --name "${RESOURCE_GROUP}" \
  --location "${LOCATION}" \
  --output none

# ---------------------------------------------------------------------------
# Storage account + blob container + table
# ---------------------------------------------------------------------------
echo "==> Ensuring storage account: ${STORAGE_ACCOUNT}"
az storage account create \
  --name "${STORAGE_ACCOUNT}" \
  --resource-group "${RESOURCE_GROUP}" \
  --location "${LOCATION}" \
  --sku Standard_LRS \
  --kind StorageV2 \
  --min-tls-version TLS1_2 \
  --allow-blob-public-access "${ALLOW_ANONYMOUS_BLOB}" \
  --output none

STORAGE_CONNECTION=$(az storage account show-connection-string \
  --name "${STORAGE_ACCOUNT}" \
  --resource-group "${RESOURCE_GROUP}" \
  --query connectionString -o tsv)

if [[ "${ALLOW_ANONYMOUS_BLOB}" == "true" ]]; then
  CONTAINER_PUBLIC_FLAG=(--public-access blob)
else
  CONTAINER_PUBLIC_FLAG=(--public-access off)
fi

echo "==> Ensuring blob container: ${BLOB_CONTAINER}"
az storage container create \
  --name "${BLOB_CONTAINER}" \
  --connection-string "${STORAGE_CONNECTION}" \
  "${CONTAINER_PUBLIC_FLAG[@]}" \
  --output none

echo "==> Ensuring table: ${TABLE_BY_TAG}"
az storage table create \
  --name "${TABLE_BY_TAG}" \
  --connection-string "${STORAGE_CONNECTION}" \
  --output none >/dev/null || true

# ---------------------------------------------------------------------------
# Log Analytics + App Insights
# ---------------------------------------------------------------------------
echo "==> Ensuring Log Analytics workspace"
az monitor log-analytics workspace create \
  --resource-group "${RESOURCE_GROUP}" \
  --workspace-name "${LOG_WORKSPACE}" \
  --location "${LOCATION}" \
  --retention-time 30 \
  --output none

WORKSPACE_ID=$(az monitor log-analytics workspace show \
  --resource-group "${RESOURCE_GROUP}" \
  --workspace-name "${LOG_WORKSPACE}" \
  --query id -o tsv)

echo "==> Ensuring Application Insights"
az monitor app-insights component create \
  --app "${APP_INSIGHTS}" \
  --location "${LOCATION}" \
  --resource-group "${RESOURCE_GROUP}" \
  --workspace "${WORKSPACE_ID}" \
  --output none

AI_CONNECTION=$(az monitor app-insights component show \
  --app "${APP_INSIGHTS}" \
  --resource-group "${RESOURCE_GROUP}" \
  --query connectionString -o tsv)

# ---------------------------------------------------------------------------
# Function App (Linux, Consumption, Node 22)
# ---------------------------------------------------------------------------
echo "==> Ensuring Function App: ${FUNCTION_APP}"
az functionapp create \
  --name "${FUNCTION_APP}" \
  --resource-group "${RESOURCE_GROUP}" \
  --storage-account "${STORAGE_ACCOUNT}" \
  --consumption-plan-location "${LOCATION}" \
  --runtime node \
  --runtime-version 22 \
  --functions-version 4 \
  --os-type Linux \
  --assign-identity '[system]' \
  --app-insights "${APP_INSIGHTS}" \
  --app-insights-key "${AI_CONNECTION}" \
  --output none

echo "==> Setting app settings"
az functionapp config appsettings set \
  --name "${FUNCTION_APP}" \
  --resource-group "${RESOURCE_GROUP}" \
  --settings \
    "UNIFORM_PROJECT_ID=${UNIFORM_PROJECT_ID}" \
    "UNIFORM_API_KEY=${UNIFORM_API_KEY}" \
    "UNIFORM_API_BASE=${UNIFORM_API_BASE}" \
    "UNIFORM_APP_BASE=${UNIFORM_APP_BASE}" \
    "MIRROR_STORAGE_CONNECTION=${STORAGE_CONNECTION}" \
    "MIRROR_BLOB_CONTAINER=${BLOB_CONTAINER}" \
    "MIRROR_TABLE_BY_TAG=${TABLE_BY_TAG}" \
    "MIRROR_RATE_LIMIT_RPS=${RATE_LIMIT_RPS}" \
    "MIRROR_DYNAMIC_EXPANSIONS=${DYNAMIC_EXPANSIONS}" \
    "MIRROR_LOCALE_PREFIXES=${LOCALE_PREFIXES}" \
    "MIRROR_SEED_TIMER_CRON=${SEED_CRON}" \
  --output none

# ---------------------------------------------------------------------------
# Function code publish
# ---------------------------------------------------------------------------
if [[ "${DO_PUBLISH}" == "true" ]]; then
  echo "==> Installing dependencies and building Function code"
  (
    cd "${FUNCTION_ROOT}"
    npm ci --silent
    npm run build --silent
  )

  echo "==> Publishing Function code"
  (
    cd "${FUNCTION_ROOT}"
    func azure functionapp publish "${FUNCTION_APP}" --typescript
  )
else
  echo "==> Skipping function publish (--no-publish)"
fi

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
FUNCTION_HOST="$(az functionapp show \
  --name "${FUNCTION_APP}" --resource-group "${RESOURCE_GROUP}" \
  --query defaultHostName -o tsv)"

BLOB_BASE="https://${STORAGE_ACCOUNT}.blob.core.windows.net/${BLOB_CONTAINER}"

echo
echo "==============================================================="
echo "  Done."
echo "==============================================================="
echo
echo "Function endpoints (function-key auth on /invalidate and /seed):"
echo "  https://${FUNCTION_HOST}/api/invalidate"
echo "  https://${FUNCTION_HOST}/api/seed"
echo
echo "Static API base URL (set as UNIFORM_STATIC_API_BASE_URL in the app):"
echo "  ${BLOB_BASE}"
echo
echo "Retrieve the invalidate function key:"
echo "  az functionapp function keys list \\"
echo "    --resource-group ${RESOURCE_GROUP} \\"
echo "    --name ${FUNCTION_APP} \\"
echo "    --function-name invalidate \\"
echo "    --query default -o tsv"
echo
echo "Wire that URL (including ?code=...) into Uniform's dependencyInvalidationHookUrl."

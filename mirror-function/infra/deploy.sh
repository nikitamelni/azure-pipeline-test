#!/usr/bin/env bash
# Wrapper for a clean two-step deploy: infra (Bicep) then code (func publish).
#
# Usage:
#   ./deploy.sh <resource-group> [<parameters-file>]
#
# Prereqs:
#   * az CLI signed in to the right subscription (az login && az account set -s ...)
#   * Azure Functions Core Tools v4 (func --version | grep ^4)
#   * Node 22 + npm
#   * A parameters file (copy main.parameters.example.json and fill in secrets)
#
# Run from the repo root:
#   ./mirror-function/infra/deploy.sh dev-nikitam-eastus-rg ./mirror-function/infra/main.parameters.json

set -euo pipefail

RG="${1:?resource-group required as first argument}"
PARAMS_FILE="${2:-./mirror-function/infra/main.parameters.json}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [[ ! -f "$PARAMS_FILE" ]]; then
  echo "Parameters file not found: $PARAMS_FILE" >&2
  echo "Copy main.parameters.example.json and fill in the values." >&2
  exit 1
fi

echo "==> Deploying Bicep template to resource group: $RG"
DEPLOY_OUTPUT=$(az deployment group create \
  --resource-group "$RG" \
  --template-file "$ROOT/infra/main.bicep" \
  --parameters @"$PARAMS_FILE" \
  --query 'properties.outputs' \
  -o json)

FUNCTION_APP_NAME=$(echo "$DEPLOY_OUTPUT" | python3 -c 'import json,sys; print(json.load(sys.stdin)["functionAppName"]["value"])')
HOSTNAME=$(echo "$DEPLOY_OUTPUT" | python3 -c 'import json,sys; print(json.load(sys.stdin)["functionAppHostName"]["value"])')

echo "==> Function app: $FUNCTION_APP_NAME ($HOSTNAME)"

echo "==> Installing dependencies and building"
pushd "$ROOT" >/dev/null
npm ci
npm run build
popd >/dev/null

echo "==> Publishing function code"
pushd "$ROOT" >/dev/null
func azure functionapp publish "$FUNCTION_APP_NAME" --typescript
popd >/dev/null

echo "==> Done."
echo
echo "Mirror endpoints:"
echo "  read:        https://$HOSTNAME/api/v1/route"
echo "  invalidate:  https://$HOSTNAME/api/invalidate?code=<function-key>"
echo "  seed:        https://$HOSTNAME/api/seed?code=<function-key>"
echo
echo "Retrieve function keys with:"
echo "  az functionapp function keys list -g $RG -n $FUNCTION_APP_NAME --function-name invalidate"
echo "  az functionapp function keys list -g $RG -n $FUNCTION_APP_NAME --function-name seed"

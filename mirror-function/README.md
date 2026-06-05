# Uniform Static API on Azure

Azure-native equivalent of [`bell/static-route-api`][bell]. Mirrors Uniform's
published `/api/v1/route` responses into Azure Blob Storage and keeps them
current in the background via `dependencyInvalidationHookUrl`. The Next.js app
reads composition JSON straight from the blob (or from Azure Front Door in
front of the blob), with a small **fetch override** on the SDK clients that
rewrites the URL on the way out.

[bell]: https://github.com/uniformdev/static-route-api

---

## Architecture

```
   ┌──────────────┐  edits / publishes
   │  Editor      ├──────────────────────────────────────────┐
   └──────────────┘                                          │
                                                             ▼
                                              ┌───────────────────────────┐
                                              │  Uniform                  │
                                              │  • CDN cache purge        │
                                              │  • dependency hook fired  │
                                              └─────────────┬─────────────┘
                                                            │ POST /api/invalidate
                                                            │ { dependencies: { … } }
                                                            ▼
                                              ┌───────────────────────────┐
                                              │  Azure Function           │
   ┌────────────────────────────────┐         │  (Consumption, Node 22)   │
   │  uniform.global                │ ◄───────┤  • invalidate (webhook)   │
   │  /api/v1/route?…               │ refetch │  • seed (manual + timer)  │
   └────────────────────────────────┘         └─────────────┬─────────────┘
                                                            │ writes
                                                            ▼
                                              ┌───────────────────────────┐
                                              │  Azure Storage            │
                                              │  • blob  edge-mirror      │
                                              │  • table byTag            │
                                              └─────────────┬─────────────┘
                                                            │ (Azure Front Door optional)
                                                            ▼
                                              ┌───────────────────────────┐
                                              │  Next.js app              │
                                              │  • Uniform SDK clients    │
                                              │  • createStaticApiFetch() │
                                              │    rewrites /api/v1/route │
                                              │    → base64url(path) URL  │
                                              │  SSR / CSR / SPA          │
                                              └───────────────────────────┘
```

**Key properties:**

- The Function is **write-only**. There is no `route` read endpoint — the app
  fetches directly from blob storage (or Front Door), so the Function is off
  the hot path for reads.
- The blob key matches `bell/static-route-api` exactly:
  `{projectId}/{base64url(path)}/64.json`. State `64` is the published state;
  draft/preview is not mirrored.
- `invalidate` is the only real-time update path. Strict
  `dependencyInvalidationHookUrl`-driven semantics — no polling, no crawl.
- `seed` is a slow rate-limited reconciliation (default 5 rps, hard-capped
  by an in-process token bucket) that runs every 6h on a timer and is also
  exposed as an HTTP endpoint for first-time population.
- Optional Azure Front Door purge after each write, gated on the four `AFD_*`
  env vars being set.

---

## Limitations

Read these before deploying.

1. **The base64url conversion happens on the app side.** The mirror does not
   serve via a Function HTTP endpoint or via an AFD edge rule. Instead, the
   Next.js app installs a [`fetch` override on the SDK clients][override]
   that intercepts requests to `/api/v1/route`, base64url-encodes the path,
   and rewrites the URL to the static-API base. This keeps Azure-side cost
   and complexity low but couples app and Function around the encoding —
   any change to the key scheme must ship to both sides simultaneously.

2. **Not recommended for SSG.** The mirror is updated asynchronously after a
   publish. If a static-export build is triggered immediately after editorial
   activity, the build may read stale JSON. SSG with this static API will
   work for steady-state content but produces a race during active editing.
   **Recommended modes: SSR, CSR, or SPA**, where reads happen at request
   time and benefit from the always-fresh background mirror.

3. **Mirror serves `state=64` (published) only.** Draft/preview flows must
   continue to hit `uniform.global` directly. The fetch override passes
   through any non-`state=64` request unchanged.

4. **`dependencyInvalidationHookUrl` fires on both draft AND published
   saves.** The mirror always re-fetches `state=64`; when the payload was
   for a draft-only change, the published JSON is byte-identical to what's
   stored and the write/purge is skipped. Harmless but worth knowing.

5. **One Uniform project per Function App.** `UNIFORM_PROJECT_ID` is
   process-global. Multi-project mirroring needs a small refactor.

6. **Stale `byTag` rows are not garbage-collected.** If a composition's
   dependency set shrinks between refreshes, old tag rows linger. They cause
   harmless no-op refreshes on invalidation. A future enhancement can sweep
   them during seed.

7. **The Function rate limit is per-instance.** Consumption Plan instances
   scale out independently. Under a heavy burst the effective RPS to Uniform
   can exceed `MIRROR_RATE_LIMIT_RPS`. The 429-backoff in `uniform.ts` is the
   safety net.

8. **The fetch override is route-only.** Calls to `/api/v1/entries`,
   `/api/v1/project-map`, `/api/v1/canvas/{id}` continue to hit
   `uniform.global`. The static API does not mirror those endpoints.

[override]: ../src/utils/staticApi/createFetch.ts

---

## Prerequisites

- **Azure CLI** ≥ 2.60 — `az --version`
- **Azure Functions Core Tools v4** — `func --version | grep ^4`
- **Node 22** + npm — `node --version`
- An Azure subscription where you can create a Resource Group, Storage
  Account, Consumption-plan Function App, App Insights, and Log Analytics
  workspace.
- A Uniform API key scoped to the target project with at least:
  - Canvas: read
  - Project Map: read
  - Entries: read

---

## Deploy

The deploy is a single shell script — `infra/deploy.sh` — that uses only
`az` and `func`. No Bicep, no ARM, no IaC tooling beyond what's already on
your machine.

### One-shot

```bash
./mirror-function/infra/deploy.sh \
  --resource-group     my-mirror-rg \
  --location           eastus \
  --name-prefix        pfgmirror \
  --uniform-project-id <UNIFORM_PROJECT_ID> \
  --uniform-api-key    <UNIFORM_API_KEY>
```

What it does, in order:

1. `az group create` (idempotent — no-op if already exists)
2. `az storage account create` with `--allow-blob-public-access true` (the
   blob URL is the app's read target; anonymous read is the standard model
   for a static API)
3. `az storage container create --public-access blob` for `edge-mirror`
4. `az storage table create` for `byTag`
5. `az monitor log-analytics workspace create`
6. `az monitor app-insights component create` linked to the workspace
7. `az functionapp create --consumption-plan-location --runtime node 22 --assign-identity` (system-assigned identity for optional AFD purge)
8. `az functionapp config appsettings set` to inject all `UNIFORM_*` and `MIRROR_*` settings
9. `npm ci && npm run build && func azure functionapp publish` (skippable with `--no-publish`)

The script ends by printing:

- The function endpoints (`/api/invalidate`, `/api/seed`)
- The static-API base URL (`https://<account>.blob.core.windows.net/edge-mirror`) — paste this into the Next.js app's `UNIFORM_STATIC_API_BASE_URL` env var
- The `az` command to fetch the invalidate function key

### Common flags

| Flag                       | Default                     | Notes                                                                |
|----------------------------|-----------------------------|----------------------------------------------------------------------|
| `--name-prefix`            | `pfgmirror`                 | Used for all resource names. Lowercase, 3–11 chars.                  |
| `--rate-limit-rps`         | `5`                         | Per-instance RPS cap to Uniform. Lower if you see 429s.              |
| `--dynamic-expansions`     | `{"location":"location"}`   | JSON map of route-segment placeholder → entry type.                  |
| `--locale-prefixes`        | `["en"]`                    | JSON array of locale prefixes to prepend during seed.                |
| `--seed-cron`              | `0 0 */6 * * *`             | NCRONTAB (6-field) for the reconciliation timer.                     |
| `--allow-anonymous-blob`   | `true`                      | Set to `false` if you front the blob with AFD-with-private-link.     |
| `--no-publish`             | publish on                  | Skip the `func publish` step (useful when iterating on infra only).  |

All flags can also be passed as uppercase env vars (e.g. `NAME_PREFIX`,
`RATE_LIMIT_RPS`). CLI flags win when both are present.

### Configuring Uniform

After the deploy completes:

```bash
RG=my-mirror-rg
FN=pfgmirror-fn

INVALIDATE_KEY=$(az functionapp function keys list \
  --resource-group $RG --name $FN --function-name invalidate \
  --query default -o tsv)

INVALIDATE_URL="https://${FN}.azurewebsites.net/api/invalidate?code=${INVALIDATE_KEY}"
echo "$INVALIDATE_URL"
```

Set `INVALIDATE_URL` as the project's `dependencyInvalidationHookUrl` (Uniform
project settings → API). Every subsequent publish (and every CDN-cacheable
save) will POST to this endpoint and the affected route blobs will refresh.

### Seeding

The mirror is empty after a fresh deploy. Run the seed once:

```bash
SEED_KEY=$(az functionapp function keys list \
  --resource-group $RG --name $FN --function-name seed \
  --query default -o tsv)

curl -X POST "https://${FN}.azurewebsites.net/api/seed?code=${SEED_KEY}"
```

Expect ~80s for ~400 routes at the default 5 rps. The response is a JSON
summary: `{ discovered, refreshed, deleted, skippedAlreadyPresent, failures, durationMs }`.
After this, the timer trigger keeps the mirror in sync.

### Wiring the app

Set in the Next.js app's environment:

```dotenv
UNIFORM_STATIC_API_BASE_URL=https://pfgmirrorst<hash>.blob.core.windows.net/edge-mirror
NEXT_PUBLIC_UNIFORM_STATIC_API_BASE_URL=https://pfgmirrorst<hash>.blob.core.windows.net/edge-mirror
```

Both variables exist because the override has to work on both sides of the
SSR/CSR boundary; Next.js inlines `NEXT_PUBLIC_*` into the browser bundle.

That's the entire integration. The app's catch-all page wires the override
in via `createStaticApiFetch` (see `src/utils/staticApi/`) and `RouteClient`
calls now resolve from the blob.

### Adding Azure Front Door (optional)

To put AFD in front of the blob for edge caching + custom domain + TLS:

```bash
az afd profile create -g $RG --profile-name pfg-uniform --sku Standard_AzureFrontDoor
az afd endpoint create -g $RG --profile-name pfg-uniform --endpoint-name pfg-uniform
az afd origin-group create -g $RG --profile-name pfg-uniform --origin-group-name mirror \
  --probe-request-type HEAD --probe-protocol Https --probe-interval-in-seconds 60 \
  --sample-size 4 --successful-samples-required 3 --additional-latency-in-milliseconds 50
az afd origin create -g $RG --profile-name pfg-uniform --origin-group-name mirror \
  --origin-name mirror-origin \
  --host-name "${STORAGE_ACCOUNT}.blob.core.windows.net" \
  --origin-host-header "${STORAGE_ACCOUNT}.blob.core.windows.net" \
  --enabled-state Enabled --priority 1 --weight 1000
az afd route create -g $RG --profile-name pfg-uniform --endpoint-name pfg-uniform \
  --route-name mirror-route --origin-group mirror \
  --patterns-to-match "/edge-mirror/*" --forwarding-protocol HttpsOnly
```

Then update the Function App's settings so it can purge AFD on writes:

```bash
SUB_ID=$(az account show --query id -o tsv)
az functionapp config appsettings set -g $RG -n $FN --settings \
  "AFD_SUBSCRIPTION_ID=$SUB_ID" \
  "AFD_RESOURCE_GROUP=$RG" \
  "AFD_PROFILE_NAME=pfg-uniform" \
  "AFD_ENDPOINT_NAME=pfg-uniform"
```

And grant the Function's system-assigned identity `CDN Profile Contributor`
on the AFD profile:

```bash
FN_PRINCIPAL=$(az functionapp identity show -g $RG -n $FN --query principalId -o tsv)
AFD_ID=$(az afd profile show -g $RG --profile-name pfg-uniform --query id -o tsv)
az role assignment create --assignee "$FN_PRINCIPAL" --role "CDN Profile Contributor" --scope "$AFD_ID"
```

Now update the app's static-API base URL to the AFD endpoint
(`https://pfg-uniform-<hash>.azurefd.net/edge-mirror`).

---

## Local development

```bash
cd mirror-function
cp local.settings.json.example local.settings.json
# Fill UNIFORM_PROJECT_ID, UNIFORM_API_KEY, and (if using a real storage account)
# MIRROR_STORAGE_CONNECTION. For Azurite (emulator), keep the defaults.

npm install
npm run build
npm start
```

The functions are exposed at `http://localhost:7071/api/...`. Test with:

```bash
# Trigger invalidate manually
curl -X POST http://localhost:7071/api/invalidate \
  -H 'Content-Type: application/json' \
  -d '{"compositions":["abc-123"]}'

# Seed
curl -X POST http://localhost:7071/api/seed
```

---

## Environment variables (Function App)

All set automatically by `deploy.sh`; documented here for reference.

| Variable                      | Required | Default                  | Purpose                                                          |
|-------------------------------|----------|--------------------------|------------------------------------------------------------------|
| `UNIFORM_PROJECT_ID`          | yes      | —                        | Project to mirror.                                                |
| `UNIFORM_API_KEY`             | yes      | —                        | API key with canvas/project-map/entries read.                     |
| `UNIFORM_API_BASE`            | no       | `https://uniform.global` | Edge API base.                                                    |
| `UNIFORM_APP_BASE`            | no       | `https://uniform.app`    | Management API base (project-map lookups).                        |
| `MIRROR_STORAGE_CONNECTION`   | yes      | —                        | Connection string for blob + table.                               |
| `MIRROR_BLOB_CONTAINER`       | no       | `edge-mirror`            | Blob container holding route JSONs.                               |
| `MIRROR_TABLE_BY_TAG`         | no       | `byTag`                  | Table mapping tag → route rows.                                   |
| `MIRROR_RATE_LIMIT_RPS`       | no       | `5`                      | Per-instance max RPS to Uniform.                                  |
| `MIRROR_DYNAMIC_EXPANSIONS`   | no       | `{}`                     | JSON map of `:placeholder` → entry type.                          |
| `MIRROR_LOCALE_PREFIXES`      | no       | `["en"]`                 | JSON array of locale prefixes to prepend during seed.             |
| `MIRROR_SEED_TIMER_CRON`      | no       | `0 0 */6 * * *`          | NCRONTAB schedule for the timer-driven seed.                      |
| `AFD_SUBSCRIPTION_ID`         | no       | —                        | Azure subscription containing the AFD profile (purge gate).       |
| `AFD_RESOURCE_GROUP`          | no       | —                        | RG of the AFD profile.                                            |
| `AFD_PROFILE_NAME`            | no       | —                        | AFD profile name.                                                 |
| `AFD_ENDPOINT_NAME`           | no       | —                        | AFD endpoint name.                                                |

---

## Environment variables (Next.js app)

| Variable                                      | Where        | Purpose                                                              |
|-----------------------------------------------|--------------|----------------------------------------------------------------------|
| `UNIFORM_STATIC_API_BASE_URL`                 | server-side  | Base URL of the static API (blob container or AFD endpoint).         |
| `NEXT_PUBLIC_UNIFORM_STATIC_API_BASE_URL`     | browser      | Same value, exposed to client bundles for CSR/SPA reads.             |
| `UNIFORM_PROJECT_ID`                          | both         | Used by the override to validate that the request matches the mirror.|

When neither base URL is set, `resolveStaticApiConfig()` returns `null` and
the app falls back to direct `uniform.global` calls. This is the safe default
for local dev where no mirror is provisioned.

---

## File layout

```
mirror-function/
├── README.md                          ← this file
├── package.json
├── tsconfig.json
├── host.json
├── local.settings.json.example
├── infra/
│   └── deploy.sh                      ← pure az CLI deployment (no Bicep)
└── src/
    ├── lib/
    │   ├── config.ts                  ← env var loader
    │   ├── keys.ts                    ← blob/table key helpers (matches bell)
    │   ├── storage.ts                 ← blob + table clients
    │   ├── uniform.ts                 ← Uniform fetch + rate limit + 429 retry
    │   ├── tags.ts                    ← dep payload → tag list ("bucket!value")
    │   ├── pathExpansion.ts           ← project-map walker + dynamic expansion
    │   ├── cdn.ts                     ← optional Azure Front Door purge
    │   └── mirror.ts                  ← refreshRoute / resolveRoutesForTags
    └── functions/
        ├── invalidate.ts              ← POST /api/invalidate
        ├── seed.ts                    ← POST /api/seed
        └── seedTimer.ts               ← timer-driven seed
```

App-side (in the Next.js project):

```
src/utils/staticApi/
├── encoding.ts                        ← browser + Node base64url
├── createFetch.ts                     ← the fetch override
└── index.ts                           ← public API + env reader
```

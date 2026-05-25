# Uniform Edge Mirror (Azure Function)

Background mirror of Uniform's `/api/v1/route` responses into Azure Blob
Storage, kept current by Uniform's `dependencyInvalidationHookUrl`. The PFG
static-export build reads route JSON from this mirror instead of hitting
`uniform.global` directly, so a 400-page build does not burst Uniform's API
and never risks 429s during deployment.

This service is intentionally **separate** from the Next.js application — it
has its own deployment lifecycle and operational footprint.

---

## Architecture

```
Editor edits in Uniform
        │
        ▼
Uniform fires dependencyInvalidationHookUrl
        │
        ▼  POST /api/invalidate?code=<function-key>
┌───────────────────────────┐         ┌──────────────────────┐
│  Azure Function           │         │ Azure Storage        │
│  (Consumption, Node 22)   │ ──────► │  edge-mirror (blob)  │
│                           │         │  byTag (table)       │
│  • invalidate (webhook)   │         └──────────────────────┘
│  • route   (read API)     │
│  • seed    (reconcile)    │                ▲
│  • seedTimer (every 6h)   │                │ GET /api/v1/route
└───────────────────────────┘                │
                                   ┌──────────────────────────┐
                                   │ Azure DevOps pipeline    │
                                   │ next build → out → $web  │
                                   │ (manually triggered      │
                                   │  from Uniform UI)        │
                                   └──────────────────────────┘
```

**Key properties:**

- `invalidate` is the **only** real-time update path. Strict invalidation
  semantics — the mirror does **not** crawl Uniform on its own except via
  the rate-limited seed.
- `seed` is a slow rate-limited reconciliation pass that runs on a timer
  (default every 6h) and is also exposed as an HTTP endpoint for manual
  invocation after first deploy or whenever a forced refresh is needed.
- `route` is the read endpoint consumed by `RouteClient` in the Next.js
  build when `UNIFORM_API_HOST` points at this Function.

---

## Prerequisites

- **Azure CLI** ≥ 2.60 — `az --version`
- **Azure Functions Core Tools v4** — `func --version` must print `4.x`
- **Node 22** + npm — `node --version`
- Azure subscription with rights to create a Resource Group, Storage Account,
  App Service Plan (Consumption / Y1), Function App, App Insights, and a Log
  Analytics workspace.
- A Uniform API key scoped to the project being mirrored, with at least:
  - Canvas: read
  - Project Map: read
  - Entries: read

---

## One-time setup

### 1. Configure deployment parameters

```bash
cp mirror-function/infra/main.parameters.example.json \
   mirror-function/infra/main.parameters.json
```

Edit `main.parameters.json`:

| Parameter             | What to set                                                    |
|-----------------------|----------------------------------------------------------------|
| `namePrefix`          | Short lowercase prefix used for all resource names.            |
| `uniformProjectId`    | The Uniform project ID (find in Uniform UI → project settings).|
| `uniformApiKey`       | A scoped API key. **Do not commit this file.**                 |
| `blobContainer`       | Leave default unless you have a naming convention.             |
| `tableByTag`          | Leave default.                                                 |
| `rateLimitRps`        | Lower if you see 429s from Uniform. Default 5 rps.             |
| `defaultLocale`       | Locale prefix used by the Next.js app (`/en/...`).             |
| `dynamicExpansions`   | JSON map of `:placeholder` → entry type. PFG: `{"location":"location"}`.|
| `seedTimerCron`       | NCRONTAB (6-field). Default: every 6h.                         |

`main.parameters.json` is in `.gitignore` — keep it that way.

### 2. Deploy infrastructure + code

```bash
cd /path/to/performance-food-service
./mirror-function/infra/deploy.sh <resource-group> ./mirror-function/infra/main.parameters.json
```

This does two things:

1. `az deployment group create` against `main.bicep` — provisions storage,
   function app, app insights.
2. `npm ci && npm run build && func azure functionapp publish ...` — pushes
   the Function code.

The script prints the function endpoints and the `az functionapp function
keys list` commands you'll need next.

### 3. Configure Uniform to call the invalidation webhook

In the Uniform project settings (the per-project API endpoint or UI surface
for `dependencyInvalidationHookUrl`), set the URL to:

```
https://<function-app>.azurewebsites.net/api/invalidate?code=<function-key>
```

Retrieve `<function-key>` with:

```bash
az functionapp function keys list \
  --resource-group <resource-group> \
  --name <function-app> \
  --function-name invalidate \
  --query default -o tsv
```

### 4. Seed the mirror

The first time you deploy, the mirror is empty. Run the seed once manually:

```bash
SEED_KEY=$(az functionapp function keys list \
  --resource-group <resource-group> \
  --name <function-app> \
  --function-name seed \
  --query default -o tsv)

curl -X POST "https://<function-app>.azurewebsites.net/api/seed?code=${SEED_KEY}"
```

Expect this to take ~80s for 400 routes at the default 5 rps. The response
is a JSON summary: `{ discovered, refreshed, skipped, failures, durationMs }`.

After this, the timer trigger handles ongoing reconciliation automatically.

### 5. Point the PFG build at the mirror

In the Azure DevOps pipeline variables for
`azure-pipelines/generate-and-deploy-static-site.yml`, set:

```
UNIFORM_API_HOST = https://<function-app>.azurewebsites.net
```

The `route` endpoint is anonymous (no function key required) since it's a
read-only path that serves the same trust level as the public site. The
build will now route `/api/v1/route` calls through the mirror.

Trigger a build. Verify in Application Insights that the build agent's
requests reach `route` and not `uniform.global` directly.

---

## Local development

```bash
cd mirror-function
cp local.settings.json.example local.settings.json
# Fill in UNIFORM_PROJECT_ID, UNIFORM_API_KEY at minimum.
# Leave MIRROR_STORAGE_CONNECTION as `UseDevelopmentStorage=true` and run
# Azurite for local blob + table emulation:
#   npm install -g azurite
#   azurite --silent --location ./.azurite

npm install
npm run build
npm start
```

The functions are exposed at `http://localhost:7071/api/...`. Test:

```bash
# Trigger invalidate manually
curl -X POST http://localhost:7071/api/invalidate \
  -H 'Content-Type: application/json' \
  -d '{"compositions":["abc-123"]}'

# Seed
curl -X POST http://localhost:7071/api/seed

# Read a route
curl "http://localhost:7071/api/v1/route?projectId=<id>&path=/en/our-locations&state=64"
```

---

## Environment variables

All set automatically by the Bicep template; listed here for reference.

| Variable                      | Required | Default                  | Purpose                                                                 |
|-------------------------------|----------|--------------------------|-------------------------------------------------------------------------|
| `UNIFORM_PROJECT_ID`          | yes      | —                        | The Uniform project to mirror.                                          |
| `UNIFORM_API_KEY`             | yes      | —                        | API key with canvas/project-map/entries read.                           |
| `UNIFORM_API_BASE`            | no       | `https://uniform.global` | Edge API base.                                                          |
| `UNIFORM_APP_BASE`            | no       | `https://uniform.app`    | Management API base (used by seed for project-map-nodes).               |
| `MIRROR_STORAGE_CONNECTION`   | yes      | —                        | Connection string for blob + tables.                                    |
| `MIRROR_BLOB_CONTAINER`       | no       | `edge-mirror`            | Blob container holding route JSONs.                                     |
| `MIRROR_TABLE_BY_TAG`         | no       | `byTag`                  | Table mapping tag → route rows.                                         |
| `MIRROR_RATE_LIMIT_RPS`       | no       | `5`                      | Per-instance max RPS to Uniform.                                        |
| `MIRROR_LOCALE_DEFAULT`       | no       | `en`                     | Locale prefix for discovered paths.                                     |
| `MIRROR_DYNAMIC_EXPANSIONS`   | no       | `{}`                     | JSON map of `:placeholder` → entry type.                                |
| `MIRROR_SEED_TIMER_CRON`      | no       | `0 0 */6 * * *`          | NCRONTAB (6-field) schedule for the timer-driven seed.                  |

---

## Operations

### Monitoring

- App Insights ingests every Function execution.
- Useful queries:

  ```kusto
  // Webhook failures
  requests
  | where name == "invalidate" and success == false
  | order by timestamp desc

  // Seed duration trend
  customEvents
  | where name == "seedTimer"
  | summarize avg(toint(customDimensions.durationMs)) by bin(timestamp, 1d)
  ```

### Function keys

Rotate periodically:

```bash
az functionapp function keys set \
  --resource-group <rg> --name <function-app> \
  --function-name invalidate --key-name default --key-value <new-secret>
```

When you rotate, also update the `dependencyInvalidationHookUrl` in the
Uniform project settings.

### Scaling notes

- Consumption Plan scales out automatically. Multiple instances each enforce
  their own in-memory rate limit, so the effective RPS can exceed
  `MIRROR_RATE_LIMIT_RPS` under heavy bursts. The 429-backoff in `uniform.ts`
  is the backstop.
- If 429s become routine, lower `MIRROR_RATE_LIMIT_RPS` and/or move to a
  Premium Plan with `WEBSITE_FUNCTIONS_INSTANCE_LIMIT` set to 1 to serialize.

---

## Known limitations

1. **Brand-new dynamic-route entries before the next seed pass.** If an
   editor adds a new `location` entry and immediately triggers a build, the
   mirror may not yet contain `/en/locations/<new-slug>` and that specific
   page will be missing from the build. Mitigations:
   - Wait for the next timer-driven seed (default 6h cadence), or
   - Manually `POST /api/seed` before triggering the pipeline, or
   - Tighten `MIRROR_SEED_TIMER_CRON` if your editorial workflow is heavy.
2. **Stale byTag rows.** If a composition's dependency set shrinks between
   fetches, old rows in `byTag` are not deleted. They cause harmless no-op
   refreshes on invalidation. A future enhancement can sweep them during
   seed.
3. **Mirror is published-state only (`state=64`).** Preview/draft flows
   continue to hit `uniform.global` directly via the unchanged
   `RUNNING_MODE=preview` path.
4. **One Uniform project per Function App.** `UNIFORM_PROJECT_ID` is
   process-global. Multi-project mirroring would need a small refactor.
5. **No surrogate-key dataResource invalidation yet.** The byTag table
   indexes `dataResources` entries verbatim from the dependency payload.
   If Uniform's payload changes the shape of those entries, the tag strings
   may not match between refresh and invalidation. Verify against a live
   payload before relying on dataResource-driven invalidation.

---

## File layout

```
mirror-function/
├── README.md                          ← this file
├── package.json
├── tsconfig.json
├── host.json                          ← Azure Functions runtime config
├── local.settings.json.example
├── .gitignore
├── infra/
│   ├── main.bicep                     ← infrastructure
│   ├── main.parameters.example.json
│   └── deploy.sh                      ← infra + code deploy wrapper
└── src/
    ├── lib/
    │   ├── config.ts                  ← env var loader
    │   ├── keys.ts                    ← blob/table key helpers
    │   ├── storage.ts                 ← blob + table clients
    │   ├── uniform.ts                 ← Uniform fetch + rate limit + 429 retry
    │   ├── tags.ts                    ← dep payload → tag list
    │   ├── pathExpansion.ts           ← project-map walker + dynamic expansion
    │   └── mirror.ts                  ← refreshRoute / resolveRoutesForTags / readRoute
    └── functions/
        ├── invalidate.ts              ← POST /api/invalidate
        ├── route.ts                   ← GET  /api/v1/route
        ├── seed.ts                    ← POST /api/seed
        └── seedTimer.ts               ← Timer-triggered seed
```

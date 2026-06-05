// POST /api/seed
//
// Reconciliation pass — walks the project map, expands dynamic segments,
// fetches anything the mirror is missing or thinks is stale. Rate-limited
// through uniform.ts (default 5 rps) so a cold-mirror seed of ~400 routes
// takes ~80s without ever bursting Uniform's API. Safe to call manually;
// also invoked on a timer by seedTimer.

import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { bootstrap, refreshRoute } from '../lib/mirror';
import { discoverPaths } from '../lib/pathExpansion';
import { purgeFrontDoor } from '../lib/cdn';
import { readRouteBlob } from '../lib/storage';
import { routeBlobKey } from '../lib/keys';
import { config } from '../lib/config';

export interface SeedSummary {
  discovered: number;
  refreshed: number;
  deleted: number;
  skippedAlreadyPresent: number;
  failures: Array<{ path: string; error: string }>;
  durationMs: number;
}

export const runSeed = async (
  ctx: Pick<InvocationContext, 'log' | 'warn' | 'error'>,
  options: { forceRefresh?: boolean } = {}
): Promise<SeedSummary> => {
  const start = Date.now();
  await bootstrap();

  const discovered = await discoverPaths();
  ctx.log(`seed: discovered ${discovered.length} paths`);

  let refreshed = 0;
  let deleted = 0;
  let skippedAlreadyPresent = 0;
  const failures: SeedSummary['failures'] = [];
  const dirtyBlobKeys: string[] = [];

  for (const path of discovered) {
    try {
      if (!options.forceRefresh) {
        const blobKey = routeBlobKey(config.uniform.projectId, path);
        const existing = await readRouteBlob(blobKey);
        if (existing) {
          skippedAlreadyPresent++;
          continue;
        }
      }
      const result = await refreshRoute(path, ctx);
      if (result.action === 'deleted') deleted++;
      else refreshed++;
      if (!result.unchanged) dirtyBlobKeys.push(result.blobKey);
    } catch (err) {
      const message = (err as Error).message;
      ctx.error(`seed: failed for ${path}: ${message}`);
      failures.push({ path, error: message });
    }
  }

  if (dirtyBlobKeys.length > 0) {
    await purgeFrontDoor(dirtyBlobKeys, ctx);
  }

  return {
    discovered: discovered.length,
    refreshed,
    deleted,
    skippedAlreadyPresent,
    failures,
    durationMs: Date.now() - start,
  };
};

app.http('seed', {
  methods: ['POST'],
  authLevel: 'function',
  route: 'seed',
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    const forceRefresh = req.query.get('force') === 'true';
    const summary = await runSeed(ctx, { forceRefresh });
    ctx.log(
      `seed: done — discovered=${summary.discovered} refreshed=${summary.refreshed} deleted=${summary.deleted} ` +
        `skippedAlreadyPresent=${summary.skippedAlreadyPresent} failures=${summary.failures.length} in ${summary.durationMs}ms`
    );
    return {
      status: summary.failures.length === 0 ? 200 : 207,
      jsonBody: summary,
    };
  },
});

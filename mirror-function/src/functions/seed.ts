// POST /api/seed
//
// Reconciliation pass — walks the project map, expands dynamic segments,
// fetches anything the mirror is missing or thinks is stale. Rate-limited
// through uniform.ts (default 5 rps) so a cold-mirror seed of ~400 routes
// takes ~80s without ever bursting Uniform's API. Safe to call manually;
// also invoked on a timer by seedTimer.

import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { bootstrap, readRoute, refreshRoute, type MirrorRoute } from '../lib/mirror';
import { discoverPaths } from '../lib/pathExpansion';

export interface SeedSummary {
  discovered: number;
  refreshed: number;
  skipped: number;
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
  let skipped = 0;
  const failures: SeedSummary['failures'] = [];

  for (const route of discovered) {
    try {
      if (!options.forceRefresh) {
        const cached = await readRoute(route.locale, route.path);
        if (cached) {
          skipped++;
          continue;
        }
      }
      await refreshRoute(route, ctx);
      refreshed++;
    } catch (err) {
      const message = (err as Error).message;
      ctx.error(`seed: failed for ${route.path}: ${message}`);
      failures.push({ path: route.path, error: message });
    }
  }

  return {
    discovered: discovered.length,
    refreshed,
    skipped,
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
      `seed: done — discovered=${summary.discovered} refreshed=${summary.refreshed} skipped=${summary.skipped} failures=${summary.failures.length} in ${summary.durationMs}ms`
    );
    return {
      status: summary.failures.length === 0 ? 200 : 207,
      jsonBody: summary,
    };
  },
});

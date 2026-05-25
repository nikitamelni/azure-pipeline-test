// Periodic reconciliation. Default schedule is every 6 hours; configurable via
// MIRROR_SEED_TIMER_CRON. Acts as a safety net for:
//   • Missed invalidation events (network drop, queue lag).
//   • New routes whose URLs never appeared in any prior dependency payload
//     (e.g. a newly created `location` entry that introduces /en/locations/<slug>).
//   • Stale rows in the byTag table whose underlying composition was deleted.
//
// The seed pass is rate-limited at the uniform.ts layer, so it cannot 429 the
// Uniform API even at first run on an empty mirror.

import { app, type InvocationContext, type Timer } from '@azure/functions';
import { config } from '../lib/config';
import { runSeed } from './seed';

app.timer('seedTimer', {
  schedule: config.mirror.seedTimerCron,
  runOnStartup: false,
  handler: async (_timer: Timer, ctx: InvocationContext): Promise<void> => {
    ctx.log(`seedTimer: starting (schedule=${config.mirror.seedTimerCron})`);
    const summary = await runSeed(ctx);
    ctx.log(
      `seedTimer: done — discovered=${summary.discovered} refreshed=${summary.refreshed} skipped=${summary.skipped} failures=${summary.failures.length} in ${summary.durationMs}ms`
    );
  },
});

// POST /api/invalidate
//
// Receives Uniform's dependencyInvalidationHookUrl payload, derives the
// affected routes via the byTag table, and refreshes each one from
// uniform.global. This is the only continuous-update path for the mirror.

import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { dependenciesToTags } from '../lib/tags';
import { bootstrap, refreshRoute, resolveRoutesForTags } from '../lib/mirror';

app.http('invalidate', {
  methods: ['POST'],
  authLevel: 'function',
  route: 'invalidate',
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    await bootstrap();

    let payload: Record<string, unknown> = {};
    try {
      const text = await req.text();
      if (text) payload = JSON.parse(text) as Record<string, unknown>;
    } catch (err) {
      ctx.warn(`invalidate: malformed JSON body: ${(err as Error).message}`);
      return { status: 400, jsonBody: { error: 'invalid JSON body' } };
    }

    const tags = dependenciesToTags(payload);
    if (tags.length === 0) {
      ctx.log('invalidate: empty payload, nothing to do');
      return { status: 200, jsonBody: { affected: 0, refreshed: 0 } };
    }

    const routes = await resolveRoutesForTags(tags);
    ctx.log(`invalidate: ${tags.length} tags → ${routes.length} affected routes`);

    let refreshed = 0;
    const failures: Array<{ path: string; error: string }> = [];
    // Sequential refresh because uniform.ts already enforces a global per-instance
    // rate limit; doing them in parallel here would just queue inside the throttle.
    for (const route of routes) {
      try {
        await refreshRoute(route, ctx);
        refreshed++;
      } catch (err) {
        const message = (err as Error).message;
        ctx.error(`invalidate: failed to refresh ${route.path}: ${message}`);
        failures.push({ path: route.path, error: message });
      }
    }

    return {
      status: failures.length === 0 ? 200 : 207,
      jsonBody: {
        tags: tags.length,
        affected: routes.length,
        refreshed,
        failures,
      },
    };
  },
});

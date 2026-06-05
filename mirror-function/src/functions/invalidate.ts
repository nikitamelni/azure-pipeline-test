// POST /api/invalidate
//
// Receives Uniform's dependencyInvalidationHookUrl payload, derives the
// affected routes via the byTag table, refreshes each one from uniform.global,
// and (if Azure Front Door is configured) purges the matching paths from the
// CDN edge. This is the only continuous-update path for the mirror.

import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { dependenciesToTags } from '../lib/tags';
import { bootstrap, refreshRoute, resolveRoutesForTags } from '../lib/mirror';
import { purgeFrontDoor } from '../lib/cdn';

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
      return { status: 200, jsonBody: { tags: 0, affected: 0, refreshed: 0, deleted: 0 } };
    }

    const paths = await resolveRoutesForTags(tags);
    ctx.log(`invalidate: ${tags.length} tags → ${paths.length} affected routes`);

    let refreshed = 0;
    let deleted = 0;
    let skipped = 0;
    const failures: Array<{ path: string; error: string }> = [];
    const dirtyBlobKeys: string[] = [];

    // Sequential refresh because uniform.ts enforces a global per-instance rate
    // limit; doing them in parallel would just queue inside the throttle.
    for (const path of paths) {
      try {
        const result = await refreshRoute(path, ctx);
        if (result.action === 'deleted') {
          deleted++;
          dirtyBlobKeys.push(result.blobKey);
        } else if (result.unchanged) {
          skipped++; // blob byte-identical, no purge needed
        } else {
          refreshed++;
          dirtyBlobKeys.push(result.blobKey);
        }
      } catch (err) {
        const message = (err as Error).message;
        ctx.error(`invalidate: failed to refresh ${path}: ${message}`);
        failures.push({ path, error: message });
      }
    }

    // Best-effort CDN purge. The blobs are already correct; if AFD fails, the
    // edge catches up at TTL. cdn.ts owns the AFD URL shape (adds the
    // container prefix and the leading slash).
    if (dirtyBlobKeys.length > 0) {
      await purgeFrontDoor(dirtyBlobKeys, ctx);
    }

    return {
      status: failures.length === 0 ? 200 : 207,
      jsonBody: {
        tags: tags.length,
        affected: paths.length,
        refreshed,
        deleted,
        skipped,
        failures,
      },
    };
  },
});

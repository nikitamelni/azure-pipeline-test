// GET /api/v1/route?projectId=...&path=...&state=64
//
// Read-only endpoint consumed by the Next.js static-export build. Mimics the
// shape of Uniform's edge endpoint so that pointing `RouteClient` at this
// Function via UNIFORM_API_HOST is a drop-in switch.

import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions';
import { config } from '../lib/config';
import { bootstrap, readRoute } from '../lib/mirror';

const FORBIDDEN_PARAMS = ['projectMapId', 'releaseId', 'withComponentIDs', 'withContentSourceMap'];

app.http('route', {
  methods: ['GET'],
  authLevel: 'anonymous', // intentionally open; this serves the build agent and is the same trust level as the public site
  route: 'v1/route',
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    await bootstrap();

    const projectId = req.query.get('projectId');
    const path = req.query.get('path');
    const state = req.query.get('state') ?? '64';

    if (!projectId || projectId !== config.uniform.projectId) {
      return { status: 400, jsonBody: { error: 'projectId is required and must match the mirror project' } };
    }
    if (!path) {
      return { status: 400, jsonBody: { error: 'path is required' } };
    }
    if (state !== '64') {
      // Only published state is mirrored; preview/draft must continue to use uniform.global directly.
      return { status: 400, jsonBody: { error: 'only state=64 (published) is served by the mirror' } };
    }
    for (const forbidden of FORBIDDEN_PARAMS) {
      if (req.query.has(forbidden)) {
        return { status: 400, jsonBody: { error: `${forbidden} is not supported by the mirror` } };
      }
    }

    // PFG's catch-all prepends `/en` via modifyPath. The locale segment is the
    // first path component; everything else is opaque to us.
    const trimmed = path.startsWith('/') ? path.slice(1) : path;
    const slash = trimmed.indexOf('/');
    const locale = slash >= 0 ? trimmed.slice(0, slash) : trimmed;
    if (!locale) {
      return { status: 400, jsonBody: { error: 'path must include a locale segment, e.g. /en/...' } };
    }

    const body = await readRoute(locale, path);
    if (!body) {
      ctx.warn(`route: cache miss for ${path}; build will get 404`);
      return { status: 404, jsonBody: { error: 'route not in mirror' } };
    }

    return {
      status: 200,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-cache' },
      body,
    };
  },
});

// Fetch override that redirects Uniform `/api/v1/route` calls at the static
// API (Azure Blob Storage / Azure Front Door), keyed by base64url(path).
//
// Pass the returned function as the `fetch` option to RouteClient (or any
// Uniform SDK client that internally hits /api/v1/route). All other requests
// pass through to the host's native fetch unchanged — the static API only
// mirrors route responses, not entries / project-map / canvas-by-id endpoints.

import { base64urlEncode } from './encoding';

export interface StaticApiFetchOptions {
  /**
   * Base URL of the static API. Trailing slashes are stripped.
   *
   *   • Direct-from-blob:   https://<account>.blob.core.windows.net/<container>
   *   • Behind Front Door:  https://<endpoint>.azurefd.net
   *
   * No path beyond the container — the override constructs the rest from the
   * Uniform query (`projectId`, `path`, `state`).
   */
  baseUrl: string;

  /** Project ID that the mirror is configured for. Used as a safety check. */
  projectId: string;

  /**
   * On 404 from the mirror, fall back to the original uniform.global request.
   * Off by default — a 404 from the mirror is treated as authoritative so the
   * caller sees a deterministic error rather than silent inconsistency. Turn
   * on if you want SSR to gracefully degrade when the mirror is incomplete.
   */
  fallbackToUpstream?: boolean;
}

const ROUTE_PATHNAME = '/api/v1/route';
const SUPPORTED_STATE = '64';

// Query params that bell/static-route-api rejects at the CloudFront edge. We
// match that policy — if any of these are present, the request is too
// advanced for the static API and must hit uniform.global.
const FORBIDDEN_PARAMS = [
  'projectMapId',
  'releaseId',
  'withComponentIDs',
  'withContentSourceMap',
  'dataResourcesVariant',
];

const toUrlString = (input: RequestInfo | URL): string => {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.toString();
  return input.url;
};

/**
 * Build a static-API fetch override that the Uniform SDK can use as a drop-in
 * replacement for global fetch on its `RouteClient`. Non-route requests pass
 * straight through to `upstreamFetch` (defaults to `globalThis.fetch`).
 */
export const createStaticApiFetch = (
  options: StaticApiFetchOptions,
  upstreamFetch: typeof fetch = (...args) => fetch(...args)
): typeof fetch => {
  const { baseUrl, projectId, fallbackToUpstream = false } = options;
  const base = baseUrl.replace(/\/+$/, '');

  return async (input, init) => {
    let urlString: string;
    try {
      urlString = toUrlString(input);
    } catch {
      return upstreamFetch(input, init);
    }

    let url: URL;
    try {
      url = new URL(urlString);
    } catch {
      return upstreamFetch(input, init);
    }

    // Pass-through gates — when any of these fail, send the request unchanged.
    if (url.pathname !== ROUTE_PATHNAME) return upstreamFetch(input, init);
    if (FORBIDDEN_PARAMS.some(p => url.searchParams.has(p))) {
      return upstreamFetch(input, init);
    }
    const reqProjectId = url.searchParams.get('projectId');
    if (reqProjectId && reqProjectId !== projectId) return upstreamFetch(input, init);

    const path = url.searchParams.get('path');
    if (!path) return upstreamFetch(input, init);

    const state = url.searchParams.get('state') ?? SUPPORTED_STATE;
    if (state !== SUPPORTED_STATE) return upstreamFetch(input, init);

    const mirrorUrl = `${base}/${projectId}/${base64urlEncode(path)}/${state}.json`;

    // Static API is read-only; we always GET regardless of how the SDK called us.
    const res = await upstreamFetch(mirrorUrl, { method: 'GET' });
    if (res.status === 404 && fallbackToUpstream) {
      return upstreamFetch(input, init);
    }
    return res;
  };
};

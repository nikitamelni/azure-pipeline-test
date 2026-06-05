import { config } from './config';

// Single in-process token bucket. Consumption Plan instances scale out, so this
// limits requests per *instance*, not globally. We compensate by setting the
// rate-limit RPS low (default 5) and by honoring Retry-After on 429.

const minIntervalMs = Math.round(1000 / config.mirror.rateLimitRps);
let lastRequestAt = 0;

const throttle = async (): Promise<void> => {
  const now = Date.now();
  const elapsed = now - lastRequestAt;
  if (elapsed < minIntervalMs) {
    await new Promise(r => setTimeout(r, minIntervalMs - elapsed));
  }
  lastRequestAt = Date.now();
};

const sleep = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

const fetchWithBackoff = async (
  url: string,
  init: RequestInit,
  maxRetries = 5
): Promise<Response> => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    await throttle();
    const res = await fetch(url, init);
    if (res.status !== 429 && res.status < 500) return res;
    if (attempt === maxRetries) return res;
    const retryAfterHeader = res.headers.get('retry-after');
    const retryAfter = retryAfterHeader ? Number(retryAfterHeader) * 1000 : 0;
    const backoff = Math.min(60_000, 500 * 2 ** attempt);
    await sleep(Math.max(backoff, retryAfter));
  }
  throw new Error('fetchWithBackoff: exhausted retries');
};

const headers = (extra?: Record<string, string>): Record<string, string> => ({
  'x-api-key': config.uniform.apiKey,
  // Bypass Uniform's edge cache so we always store the freshest payload —
  // important because the dependency-invalidation hook fires AFTER the edge
  // has been purged, but a cached response from before the purge could still
  // be served briefly.
  'x-bypass-cache': 'true',
  // Ask Uniform to include the `dependencies` field in the response, mirroring
  // bell/static-route-api's behavior. Without this header the field is omitted.
  'x-uniform-deps': 'true',
  ...(extra ?? {}),
});

export interface RouteFetchResult {
  /** Composition payload with `dependencies` stripped — what gets written to blob. */
  body: Record<string, unknown>;
  /** Dependency descriptor for the byTag table; undefined if the response was a notFound/redirect. */
  dependencies: Record<string, unknown> | undefined;
}

/**
 * Fetch `/api/v1/route` for a single path from the Uniform edge. Mirrors
 * exactly what `RouteClient` would call (state=64 = published).
 */
export const fetchRoute = async (
  path: string,
  state: number = 64
): Promise<RouteFetchResult> => {
  const url = new URL('/api/v1/route', config.uniform.apiBase);
  url.searchParams.set('projectId', config.uniform.projectId);
  url.searchParams.set('path', path);
  url.searchParams.set('state', String(state));

  const res = await fetchWithBackoff(url.toString(), { headers: headers() });
  if (!res.ok) {
    throw new Error(`fetchRoute(${path}) failed: ${res.status} ${res.statusText}`);
  }
  const raw = (await res.json()) as Record<string, unknown> & {
    dependencies?: Record<string, unknown>;
  };
  const { dependencies, ...body } = raw;
  return { body, dependencies };
};

/**
 * Look up the default project map id. `/api/v1/project-map-nodes` requires
 * `projectMapId`, so this is the first leg of the two-step discovery flow.
 * Matches the bell/static-route-api seed implementation.
 */
const fetchDefaultProjectMapId = async (): Promise<string> => {
  const url = new URL('/api/v1/project-map', config.uniform.appBase);
  url.searchParams.set('projectId', config.uniform.projectId);

  const res = await fetchWithBackoff(url.toString(), { headers: headers() });
  if (!res.ok) {
    throw new Error(`fetchDefaultProjectMapId failed: ${res.status} ${res.statusText}`);
  }
  const body = (await res.json()) as {
    projectMaps?: Array<{ id: string; default?: boolean }>;
  };
  const maps = body.projectMaps ?? [];
  const id = maps.find(m => m.default)?.id ?? maps[0]?.id;
  if (!id) {
    throw new Error(`No project map found for projectId ${config.uniform.projectId}`);
  }
  return id;
};

/**
 * Fetch the expanded project map nodes for reconciliation. `expanded=true`
 * returns templated paths including dynamic placeholders like `:locale` and
 * `:location`, which the seed expands into concrete URLs.
 */
export const fetchProjectMapNodes = async (): Promise<Array<Record<string, unknown>>> => {
  const projectMapId = await fetchDefaultProjectMapId();

  const url = new URL('/api/v1/project-map-nodes', config.uniform.appBase);
  url.searchParams.set('projectId', config.uniform.projectId);
  url.searchParams.set('projectMapId', projectMapId);
  url.searchParams.set('expanded', 'true');

  const res = await fetchWithBackoff(url.toString(), { headers: headers() });
  if (!res.ok) {
    throw new Error(`fetchProjectMapNodes failed: ${res.status} ${res.statusText}`);
  }
  const body = (await res.json()) as {
    nodes?: Array<Record<string, unknown>>;
    projectMapNodes?: Array<Record<string, unknown>>;
  };
  return body.nodes ?? body.projectMapNodes ?? [];
};

// /api/v1/entries hard-caps `limit` at 50 per request. Anything higher returns
// 400 ("limit parameter cannot exceed 50"). We page through with offset.
const ENTRIES_PAGE_SIZE = 50;

/**
 * Fetch entries of a given content type. Used to expand `:placeholder`
 * segments in the project map (e.g. :location → location entries) during seed.
 *
 * @param type      Content type ID to filter by (e.g. "location").
 * @param maxTotal  Upper bound on total entries to return across pages.
 */
export const fetchEntries = async (
  type: string,
  maxTotal = 1000
): Promise<Array<Record<string, unknown>>> => {
  const collected: Array<Record<string, unknown>> = [];
  let offset = 0;

  while (collected.length < maxTotal) {
    const remaining = maxTotal - collected.length;
    const limit = Math.min(ENTRIES_PAGE_SIZE, remaining);

    const url = new URL('/api/v1/entries', config.uniform.apiBase);
    url.searchParams.set('projectId', config.uniform.projectId);
    url.searchParams.set('type', type);
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('offset', String(offset));
    url.searchParams.set('state', '64');

    const res = await fetchWithBackoff(url.toString(), { headers: headers() });
    if (!res.ok) {
      throw new Error(`fetchEntries(${type}) failed: ${res.status} ${res.statusText}`);
    }
    const body = (await res.json()) as { entries?: Array<Record<string, unknown>> };
    const page = body.entries ?? [];
    collected.push(...page);
    if (page.length < limit) break; // last page reached
    offset += page.length;
  }

  return collected;
};

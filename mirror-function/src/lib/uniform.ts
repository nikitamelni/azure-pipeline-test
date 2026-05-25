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
  // unreachable
  throw new Error('fetchWithBackoff: exhausted retries');
};

const headers = (): Record<string, string> => ({
  'x-api-key': config.uniform.apiKey,
  'x-bypass-cache': 'true',
});

export interface RouteFetchResult {
  /** The composition payload, with `dependencies` stripped. Identical shape to uniform.global's response. */
  body: Record<string, unknown>;
  /** Dependency descriptor (compositions, components, entries, ...) for the byTag table. */
  dependencies: Record<string, unknown> | undefined;
}

/**
 * Fetch `/api/v1/route` for a single path from the Uniform edge.
 * Mirrors exactly what `RouteClient` would call.
 */
export const fetchRoute = async (path: string, state = 64): Promise<RouteFetchResult> => {
  const url = new URL('/api/v1/route', config.uniform.apiBase);
  url.searchParams.set('projectId', config.uniform.projectId);
  url.searchParams.set('path', path);
  url.searchParams.set('state', String(state));

  const res = await fetchWithBackoff(url.toString(), { headers: headers() });
  if (!res.ok) {
    throw new Error(`fetchRoute(${path}) failed: ${res.status} ${res.statusText}`);
  }
  const raw = (await res.json()) as Record<string, unknown> & { dependencies?: Record<string, unknown> };
  const { dependencies, ...body } = raw;
  return { body, dependencies };
};

/** Fetch the published project map nodes. Used by the seed timer for reconciliation. */
export const fetchProjectMapNodes = async (): Promise<Array<Record<string, unknown>>> => {
  const url = new URL('/api/v1/project-map-nodes', config.uniform.appBase);
  url.searchParams.set('projectId', config.uniform.projectId);
  url.searchParams.set('state', '64');

  const res = await fetchWithBackoff(url.toString(), { headers: headers() });
  if (!res.ok) {
    throw new Error(`fetchProjectMapNodes failed: ${res.status} ${res.statusText}`);
  }
  const body = (await res.json()) as { projectMapNodes?: Array<Record<string, unknown>> };
  return body.projectMapNodes ?? [];
};

/**
 * Fetch entries of a given content type. Used to expand `:placeholder` segments
 * in the project map (e.g. :location → list of location entries) during seed.
 */
export const fetchEntries = async (type: string, limit = 100): Promise<Array<Record<string, unknown>>> => {
  const url = new URL('/api/v1/entries', config.uniform.apiBase);
  url.searchParams.set('projectId', config.uniform.projectId);
  url.searchParams.set('type', type);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('state', '64');

  const res = await fetchWithBackoff(url.toString(), { headers: headers() });
  if (!res.ok) {
    throw new Error(`fetchEntries(${type}) failed: ${res.status} ${res.statusText}`);
  }
  const body = (await res.json()) as { entries?: Array<Record<string, unknown>> };
  return body.entries ?? [];
};

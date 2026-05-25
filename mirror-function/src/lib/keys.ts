// Helpers for translating (projectId, locale, path) into stable, URL-safe keys
// used by both the blob container and the byTag table. base64url encoding lets
// us round-trip any path (including '/' and query-safe chars) into a single
// blob-name segment.

const base64url = (input: string): string => Buffer.from(input, 'utf8').toString('base64url');

export const routeBlobKey = (projectId: string, locale: string, path: string): string =>
  `${projectId}/${locale}/${base64url(path)}/64.json`;

export const routeRowKey = (locale: string, path: string): string =>
  `${locale}#${base64url(path)}`;

/**
 * Build a partition key for the byTag table. Tag IDs come from Uniform
 * dependency invalidation payloads and are namespaced by their bucket
 * (compositions, components, entries, projectMapNodes, dataResources, ...).
 */
export const tagPartitionKey = (projectId: string, tag: string): string => `${projectId}#${tag}`;

/** Parse a row key back into (locale, path). Returns null if the row key is malformed. */
export const parseRouteRowKey = (rowKey: string): { locale: string; path: string } | null => {
  const idx = rowKey.indexOf('#');
  if (idx < 0) return null;
  const locale = rowKey.slice(0, idx);
  const b64 = rowKey.slice(idx + 1);
  try {
    const path = Buffer.from(b64, 'base64url').toString('utf8');
    return { locale, path };
  } catch {
    return null;
  }
};

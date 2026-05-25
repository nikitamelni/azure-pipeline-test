// Convert a Uniform `dependencies` payload (from /api/v1/route responses, or
// from the dependencyInvalidationHookUrl body) into a flat list of tag strings.
//
// A tag is `{bucket}:{id}` (e.g. `compositions:abc-123`). dataResources are
// canonicalized via stable JSON because they can carry small inline objects
// rather than ID strings.

const stableStringify = (obj: unknown): string => {
  if (obj === null || obj === undefined) return JSON.stringify(obj ?? null);
  if (typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(stableStringify).join(',') + ']';
  const o = obj as Record<string, unknown>;
  const keys = Object.keys(o).sort();
  return '{' + keys.map(k => JSON.stringify(k) + ':' + stableStringify(o[k])).join(',') + '}';
};

export const dependenciesToTags = (
  deps: Record<string, unknown> | undefined
): string[] => {
  if (!deps || typeof deps !== 'object') return [];
  const tags = new Set<string>();
  for (const [bucket, items] of Object.entries(deps)) {
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      if (typeof item === 'string') {
        tags.add(`${bucket}:${item}`);
      } else if (item && typeof item === 'object') {
        tags.add(`${bucket}:${stableStringify(item)}`);
      }
    }
  }
  return Array.from(tags);
};

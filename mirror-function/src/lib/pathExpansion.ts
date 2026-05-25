// Replicates the project-map + dynamic-entry expansion that the PFG catch-all
// performs in getStaticPaths, so the seed timer can reconcile the mirror
// against the full live URL set.
//
// The expansion is configured generically via MIRROR_DYNAMIC_EXPANSIONS, a
// JSON map of route-segment placeholder -> Uniform entry type. For PFG that
// is `{ "location": "location" }`. Other projects can add their own without
// changing this code.

import { config } from './config';
import { fetchEntries, fetchProjectMapNodes } from './uniform';

export interface DiscoveredPath {
  path: string;
  locale: string;
}

const DYNAMIC_SEGMENT = /:(\w+)/;

const slugFromEntry = (entry: Record<string, unknown>): string | undefined => {
  // Uniform's `/api/v1/entries` returns entries as `{ entry: { _slug, ... } }`.
  // Fall back to a top-level `_slug` for safety.
  const wrapped = (entry as { entry?: Record<string, unknown> }).entry;
  const slug = (wrapped?._slug ?? entry._slug) as unknown;
  return typeof slug === 'string' && slug.length > 0 ? slug : undefined;
};

/**
 * Walk the project map and return the full set of URL paths that should exist
 * in the mirror, prefixed with the default locale.
 */
export const discoverPaths = async (): Promise<DiscoveredPath[]> => {
  const nodes = await fetchProjectMapNodes();

  // Templated paths from the project map. Strip the Uniform-side `:locale`
  // placeholder; we prepend our own locale prefix below.
  const templatePaths = nodes
    .filter(n => (n as { type?: unknown }).type === 'composition')
    .map(n => String((n as { path?: unknown }).path ?? '').replace('/:locale', ''))
    .filter(p => p.length > 0);

  // Cache expanded slug lists per entry type so we don't re-fetch within one
  // discovery pass.
  const slugCache = new Map<string, string[]>();
  const slugsFor = async (entryType: string): Promise<string[]> => {
    const cached = slugCache.get(entryType);
    if (cached) return cached;
    const entries = await fetchEntries(entryType, 200);
    const slugs = entries.map(slugFromEntry).filter((s): s is string => Boolean(s));
    slugCache.set(entryType, slugs);
    return slugs;
  };

  const expanded: string[] = [];
  for (const template of templatePaths) {
    const match = template.match(DYNAMIC_SEGMENT);
    if (!match) {
      expanded.push(template);
      continue;
    }
    const placeholder = match[1];
    const entryType = config.mirror.dynamicExpansions[placeholder];
    if (!entryType) {
      // Unknown dynamic segment — skip. A 404 on the build for this path is
      // the same outcome as never expanding it, so erring on the side of "do
      // nothing" is safer than guessing.
      continue;
    }
    const slugs = await slugsFor(entryType);
    for (const slug of slugs) {
      expanded.push(template.replace(`:${placeholder}`, slug));
    }
  }

  return expanded.map(p => ({
    path: `/${config.mirror.defaultLocale}${p}`,
    locale: config.mirror.defaultLocale,
  }));
};

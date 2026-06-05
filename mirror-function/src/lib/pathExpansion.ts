// Replicates the project-map + dynamic-entry expansion that the Next.js catch-all
// would perform in getStaticPaths, so the seed timer can reconcile the mirror
// against the full live URL set.
//
// The expansion is configured generically:
//   * MIRROR_DYNAMIC_EXPANSIONS — JSON map of route placeholder → entry type
//     (e.g. `{ "location": "location" }`).
//   * MIRROR_LOCALE_PREFIXES — JSON array of locale prefixes to prepend
//     (e.g. `["en"]`).

import { config } from './config';
import { fetchEntries, fetchProjectMapNodes } from './uniform';

const DYNAMIC_SEGMENT = /:(\w+)/;
const LOCALE_PLACEHOLDER = '/:locale';

const slugFromEntry = (entry: Record<string, unknown>): string | undefined => {
  // `/api/v1/entries` returns entries as `{ entry: { _slug, ... } }`. Fall back
  // to a top-level `_slug` for resilience to API shape changes.
  const wrapped = (entry as { entry?: Record<string, unknown> }).entry;
  const slug = (wrapped?._slug ?? entry._slug) as unknown;
  return typeof slug === 'string' && slug.length > 0 ? slug : undefined;
};

/**
 * Walk the project map and return the full set of URL paths that should exist
 * in the mirror, with one entry per (locale, expanded-path) pair.
 */
export const discoverPaths = async (): Promise<string[]> => {
  const nodes = await fetchProjectMapNodes();

  // Composition-typed template paths only. Strip Uniform's `:locale`
  // placeholder; we prepend our own locale prefix below.
  const templatePaths = nodes
    .filter(n => (n as { type?: unknown }).type === 'composition')
    .map(n => String((n as { path?: unknown }).path ?? '').replace(LOCALE_PLACEHOLDER, ''))
    .filter(p => p.length > 0);

  // Cache expanded slug lists per entry type so we don't re-fetch within one
  // discovery pass.
  const slugCache = new Map<string, string[]>();
  const slugsFor = async (entryType: string): Promise<string[]> => {
    const cached = slugCache.get(entryType);
    if (cached) return cached;
    const entries = await fetchEntries(entryType);
    const slugs = entries.map(slugFromEntry).filter((s): s is string => Boolean(s));
    slugCache.set(entryType, slugs);
    return slugs;
  };

  // Loop until every `:placeholder` is resolved or we hit one we can't expand.
  // This handles templates with multiple dynamic segments (e.g.
  // `/locations/:region/:location`) by expanding one at a time and producing
  // the cross-product. Unknown placeholders cause the template to be dropped
  // entirely — see the comment below.
  const expandTemplate = async (template: string): Promise<string[]> => {
    let queue: string[] = [template];
    while (queue.some(t => DYNAMIC_SEGMENT.test(t))) {
      const next: string[] = [];
      for (const t of queue) {
        const match = t.match(DYNAMIC_SEGMENT);
        if (!match) {
          next.push(t);
          continue;
        }
        const placeholder = match[1];
        const entryType = config.mirror.dynamicExpansions[placeholder];
        if (!entryType) {
          // Unknown dynamic segment — skip the whole template. A 404 on the
          // build for this path is the same outcome as never expanding it,
          // so erring on the side of "do nothing" is safer than guessing.
          return [];
        }
        const slugs = await slugsFor(entryType);
        for (const slug of slugs) {
          next.push(t.replace(`:${placeholder}`, slug));
        }
      }
      queue = next;
    }
    return queue;
  };

  const expanded: string[] = [];
  for (const template of templatePaths) {
    const fully = await expandTemplate(template);
    expanded.push(...fully);
  }

  // Cross-product against locale prefixes.
  const final: string[] = [];
  for (const locale of config.mirror.localePrefixes) {
    for (const p of expanded) final.push(`/${locale}${p}`);
  }
  return final;
};

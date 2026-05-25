// Core mirror operations shared by the HTTP handlers (invalidate, seed) and
// the timer trigger.

import { odata, type TableEntity } from '@azure/data-tables';
import { config } from './config';
import { fetchRoute } from './uniform';
import {
  ensureStorage,
  getTagTable,
  readRouteBlob,
  writeRouteBlob,
} from './storage';
import { dependenciesToTags } from './tags';
import {
  parseRouteRowKey,
  routeBlobKey,
  routeRowKey,
  tagPartitionKey,
} from './keys';
import type { InvocationContext } from '@azure/functions';

export interface MirrorRoute {
  path: string;
  locale: string;
}

/**
 * Fetch a single route from Uniform, write it to blob storage, and update the
 * byTag table with the new dependency set. Stripping `dependencies` from the
 * stored body matches the bell/static-route-api convention and keeps blob size
 * down.
 */
export const refreshRoute = async (
  route: MirrorRoute,
  ctx?: Pick<InvocationContext, 'log'>
): Promise<void> => {
  const { body, dependencies } = await fetchRoute(route.path);
  const blobKey = routeBlobKey(config.uniform.projectId, route.locale, route.path);
  await writeRouteBlob(blobKey, body);

  const tags = dependenciesToTags(dependencies);
  const rowKey = routeRowKey(route.locale, route.path);

  // Upsert one row per tag pointing at this route. We never delete obsolete
  // tag rows here (the tag set can shrink between fetches); a periodic
  // reconciliation pass should clean those up. For now they're harmless —
  // worst case they cause a no-op refresh.
  if (tags.length === 0) {
    ctx?.log?.(`refreshRoute: ${route.path} fetched with no dependencies; byTag not updated.`);
    return;
  }

  const table = getTagTable();
  await Promise.all(
    tags.map(tag =>
      table.upsertEntity<TableEntity<{ refreshedAt: string }>>({
        partitionKey: tagPartitionKey(config.uniform.projectId, tag),
        rowKey,
        refreshedAt: new Date().toISOString(),
      }, 'Replace')
    )
  );
};

/**
 * Resolve a list of tags (from a dependencyInvalidationHookUrl payload) into
 * the distinct set of routes whose stored JSON references those tags.
 */
export const resolveRoutesForTags = async (tags: string[]): Promise<MirrorRoute[]> => {
  if (tags.length === 0) return [];
  const table = getTagTable();
  const seen = new Map<string, MirrorRoute>();

  for (const tag of tags) {
    const pk = tagPartitionKey(config.uniform.projectId, tag);
    const iter = table.listEntities({
      queryOptions: { filter: odata`PartitionKey eq ${pk}` },
    });
    for await (const row of iter) {
      const parsed = parseRouteRowKey(String(row.rowKey ?? ''));
      if (!parsed) continue;
      const key = `${parsed.locale}|${parsed.path}`;
      if (!seen.has(key)) seen.set(key, parsed);
    }
  }
  return Array.from(seen.values());
};

/**
 * Read a cached route JSON for the static-export build to consume. Returns the
 * raw bytes (as fetched from blob) or null if the mirror has no copy.
 */
export const readRoute = async (locale: string, path: string): Promise<Buffer | null> => {
  return readRouteBlob(routeBlobKey(config.uniform.projectId, locale, path));
};

export const bootstrap = ensureStorage;

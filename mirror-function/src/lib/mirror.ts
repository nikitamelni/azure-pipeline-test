// Core mirror operations shared by the HTTP handlers (invalidate, seed) and
// the timer trigger. Drop-in semantically equivalent to bell/static-route-api's
// renderAffected + renderAndSyncAll, with Azure Storage in place of S3/DynamoDB.

import { odata, type TableEntity } from '@azure/data-tables';
import { config } from './config';
import { fetchRoute } from './uniform';
import {
  deleteRouteBlob,
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
  STATE_PUBLISHED,
  tagPartitionKey,
} from './keys';
import type { InvocationContext } from '@azure/functions';

export interface RefreshResult {
  /** Blob key that was written or deleted, e.g. `{projectId}/<b64>/64.json`. */
  blobKey: string;
  /** `written` when the route resolved to a published composition; `deleted` otherwise. */
  action: 'written' | 'deleted';
  /** True if the stored blob is byte-identical to what was already there — caller may skip CDN purge. */
  unchanged?: boolean;
}

/**
 * Fetch a single route from Uniform and reconcile blob storage:
 *   • published composition   → write the blob + upsert byTag rows
 *   • anything else (notFound,
 *     redirect, unknown)      → delete the blob (so the app falls through to a 404)
 *
 * Returns the blob key so callers can collect them for a single batched CDN
 * purge instead of one purge per route.
 */
export const refreshRoute = async (
  path: string,
  ctx?: Pick<InvocationContext, 'log'>
): Promise<RefreshResult> => {
  const { body, dependencies } = await fetchRoute(path);
  const blobKey = routeBlobKey(config.uniform.projectId, path);

  const routeType = (body as { type?: string }).type;
  if (routeType !== 'composition') {
    await deleteRouteBlob(blobKey);
    ctx?.log?.(`refreshRoute: ${path} resolved to '${routeType ?? 'unknown'}'; blob deleted.`);
    return { blobKey, action: 'deleted' };
  }

  // Compare with what's currently stored — when the dep hook fires for an
  // unrelated draft save, the published JSON is unchanged. Skipping the
  // write here keeps blob churn and downstream CDN purges off the hot path.
  const newBytes = Buffer.from(JSON.stringify(body), 'utf8');
  const existing = await readRouteBlob(blobKey);
  const unchanged = existing !== null && existing.equals(newBytes);

  if (!unchanged) {
    await writeRouteBlob(blobKey, body);
  }

  const tags = dependenciesToTags(dependencies);
  const rowKey = routeRowKey(path);

  if (tags.length === 0) {
    ctx?.log?.(`refreshRoute: ${path} fetched with no dependencies; byTag not updated.`);
    return { blobKey, action: 'written', unchanged };
  }

  // Upsert one row per tag pointing at this route. We never delete obsolete
  // tag rows here (the tag set can shrink between fetches); a periodic
  // reconciliation pass should clean those up. For now they're harmless —
  // worst case they cause a redundant refresh.
  const table = getTagTable();
  await Promise.all(
    tags.map(tag =>
      table.upsertEntity<TableEntity<{ refreshedAt: string }>>(
        {
          partitionKey: tagPartitionKey(config.uniform.projectId, tag),
          rowKey,
          refreshedAt: new Date().toISOString(),
        },
        'Replace'
      )
    )
  );

  return { blobKey, action: 'written', unchanged };
};

/**
 * Resolve a list of tags (from a dependencyInvalidationHookUrl payload) into
 * the distinct set of route paths whose stored JSON references those tags.
 */
export const resolveRoutesForTags = async (tags: string[]): Promise<string[]> => {
  if (tags.length === 0) return [];
  const table = getTagTable();
  const seen = new Set<string>();

  for (const tag of tags) {
    const pk = tagPartitionKey(config.uniform.projectId, tag);
    const iter = table.listEntities({
      queryOptions: { filter: odata`PartitionKey eq ${pk}` },
    });
    for await (const row of iter) {
      const path = parseRouteRowKey(String(row.rowKey ?? ''));
      if (path) seen.add(path);
    }
  }
  return Array.from(seen);
};

/**
 * Read the cached JSON for a path. Production app reads go directly to the
 * blob URL via the fetch override (no Function hop), but this helper is used
 * by the local-dev `read` endpoint to test the mirror without provisioning a
 * public container.
 */
export const readRoute = async (path: string): Promise<Buffer | null> => {
  return readRouteBlob(routeBlobKey(config.uniform.projectId, path, STATE_PUBLISHED));
};

export const bootstrap = ensureStorage;

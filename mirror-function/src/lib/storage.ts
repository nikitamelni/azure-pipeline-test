import { BlobServiceClient, type ContainerClient } from '@azure/storage-blob';
import { TableClient } from '@azure/data-tables';
import { config } from './config';

// Singleton clients — the Functions runtime keeps the module alive across
// invocations within an instance, so caching here saves the connection setup
// cost on warm starts.

let _blobService: BlobServiceClient | undefined;
const blobService = (): BlobServiceClient => {
  if (!_blobService) {
    _blobService = BlobServiceClient.fromConnectionString(config.storage.connectionString);
  }
  return _blobService;
};

let _container: ContainerClient | undefined;
export const getBlobContainer = (): ContainerClient => {
  if (!_container) {
    _container = blobService().getContainerClient(config.storage.blobContainer);
  }
  return _container;
};

let _byTagTable: TableClient | undefined;
export const getTagTable = (): TableClient => {
  if (!_byTagTable) {
    _byTagTable = TableClient.fromConnectionString(
      config.storage.connectionString,
      config.storage.tableByTag
    );
  }
  return _byTagTable;
};

/**
 * Create the blob container and table if they don't exist. The container is
 * created with anonymous blob read access so the Next.js app's fetch override
 * can pull JSON directly without auth. The deploy script does the same on the
 * storage account; this is a safety net for ad-hoc/local setups.
 */
export const ensureStorage = async (): Promise<void> => {
  await getBlobContainer().createIfNotExists({ access: 'blob' });
  try {
    await getTagTable().createTable();
  } catch (err) {
    const e = err as { statusCode?: number };
    if (e?.statusCode !== 409) throw err;
  }
};

export const writeRouteBlob = async (blobKey: string, json: unknown): Promise<void> => {
  const block = getBlobContainer().getBlockBlobClient(blobKey);
  const body = JSON.stringify(json);
  await block.upload(body, Buffer.byteLength(body), {
    blobHTTPHeaders: {
      blobContentType: 'application/json; charset=utf-8',
      // Short TTL is a deliberate choice when no CDN is in front: the app
      // hits blob storage on every request, but reads always see the latest
      // version within 60s of a publish without needing an active purge.
      // When Azure Front Door is configured (see purge in cdn.ts), the AFD
      // cache rules override this.
      blobCacheControl: 'public, max-age=60',
    },
  });
};

export const deleteRouteBlob = async (blobKey: string): Promise<void> => {
  const block = getBlobContainer().getBlockBlobClient(blobKey);
  try {
    await block.delete({ deleteSnapshots: 'include' });
  } catch (err) {
    const e = err as { statusCode?: number };
    if (e?.statusCode === 404) return; // already gone — idempotent
    throw err;
  }
};

export const readRouteBlob = async (blobKey: string): Promise<Buffer | null> => {
  const block = getBlobContainer().getBlockBlobClient(blobKey);
  try {
    return await block.downloadToBuffer();
  } catch (err) {
    const e = err as { statusCode?: number };
    if (e?.statusCode === 404) return null;
    throw err;
  }
};

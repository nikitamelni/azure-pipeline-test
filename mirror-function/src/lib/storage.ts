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
 * Create the blob container and table if they don't exist. Safe to call on
 * every cold start; createIfNotExists is idempotent.
 */
export const ensureStorage = async (): Promise<void> => {
  await getBlobContainer().createIfNotExists();
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
      // Build agents fetch these blobs once per build; we don't want them to
      // pin a stale copy. Editors will read them indirectly through Front Door
      // on the final site, never directly from this container.
      blobCacheControl: 'no-cache',
    },
  });
};

export const readRouteBlob = async (blobKey: string): Promise<Buffer | null> => {
  const block = getBlobContainer().getBlockBlobClient(blobKey);
  try {
    const res = await block.downloadToBuffer();
    return res;
  } catch (err) {
    const e = err as { statusCode?: number };
    if (e?.statusCode === 404) return null;
    throw err;
  }
};

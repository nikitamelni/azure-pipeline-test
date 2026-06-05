// Azure Front Door content purge. Optional — gated on the four AFD_* env vars
// being present (see config.isFrontDoorConfigured()). When AFD is not in front
// of the storage account, this is a no-op and the blobs' own short
// Cache-Control: max-age=60 is the freshness mechanism.
//
// Uses managed identity. The Function App must have a system-assigned identity
// with the role `CDN Profile Contributor` (or higher) on the AFD profile.

import { DefaultAzureCredential } from '@azure/identity';
import { config, isFrontDoorConfigured } from './config';
import type { InvocationContext } from '@azure/functions';

let _credential: DefaultAzureCredential | undefined;
const credential = (): DefaultAzureCredential => {
  if (!_credential) _credential = new DefaultAzureCredential();
  return _credential;
};

/**
 * Purge a list of blob keys from Azure Front Door. Callers pass raw blob keys
 * (no leading slash, no container) — we own the AFD path shape here.
 *
 * AFD receives requests at `/<container>/<blobKey>` because the storage
 * account is the origin and the container name is part of the storage URL.
 * The purge body must use the same path. Best-effort: a purge failure is
 * logged but does not throw — the blobs themselves are already correct, and
 * AFD will catch up at TTL.
 */
export const purgeFrontDoor = async (
  blobKeys: string[],
  ctx?: Pick<InvocationContext, 'log' | 'warn' | 'error'>
): Promise<void> => {
  if (!isFrontDoorConfigured()) {
    ctx?.log?.('purgeFrontDoor: AFD not configured, skipping');
    return;
  }
  if (blobKeys.length === 0) return;

  const { subscriptionId, resourceGroup, profileName, endpointName } = config.frontDoor;
  const url =
    `https://management.azure.com/subscriptions/${subscriptionId}` +
    `/resourceGroups/${resourceGroup}` +
    `/providers/Microsoft.Cdn/profiles/${profileName}` +
    `/afdEndpoints/${endpointName}/purge?api-version=2024-02-01`;

  // Strip any accidental leading slashes from callers and prepend the
  // container — what AFD sees in the request path.
  const contentPaths = blobKeys.map(k => {
    const stripped = k.replace(/^\/+/, '');
    return `/${config.storage.blobContainer}/${stripped}`;
  });

  let token: string;
  try {
    const t = await credential().getToken('https://management.azure.com/.default');
    if (!t) throw new Error('credential returned no token');
    token = t.token;
  } catch (err) {
    ctx?.error?.(`purgeFrontDoor: token acquisition failed: ${(err as Error).message}`);
    return;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contentPaths }),
    });
    if (!res.ok && res.status !== 202) {
      const text = await res.text().catch(() => '');
      ctx?.error?.(`purgeFrontDoor: ${res.status} ${res.statusText} ${text}`);
      return;
    }
    ctx?.log?.(`purgeFrontDoor: queued purge for ${contentPaths.length} path(s)`);
  } catch (err) {
    ctx?.error?.(`purgeFrontDoor: HTTP error: ${(err as Error).message}`);
  }
};

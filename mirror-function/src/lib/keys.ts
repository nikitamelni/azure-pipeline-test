// Blob and table keys. Matches the AWS reference (bell/static-route-api):
//
//   blob :  {projectId}/{base64url(path)}/{state}.json
//   row  :  base64url(path)
//
// No locale segment — locale is part of the path (e.g. `/en/our-locations`),
// which keeps the keying identical to what the app's fetch override will
// compute client-side.

const base64url = (input: string): string => Buffer.from(input, 'utf8').toString('base64url');

export const STATE_PUBLISHED = 64;

export const routeBlobKey = (
  projectId: string,
  path: string,
  state: number = STATE_PUBLISHED
): string => `${projectId}/${base64url(path)}/${state}.json`;

/**
 * Row key for the byTag table. Same base64url as the blob key segment so the
 * two are trivially correlated when debugging.
 */
export const routeRowKey = (path: string): string => base64url(path);

export const parseRouteRowKey = (rowKey: string): string | null => {
  try {
    return Buffer.from(rowKey, 'base64url').toString('utf8');
  } catch {
    return null;
  }
};

/**
 * Partition key for the byTag table. `tag` carries Uniform's dependency
 * bucket+id pair (e.g. `compositions!abc-123`).
 */
export const tagPartitionKey = (projectId: string, tag: string): string => `${projectId}#${tag}`;

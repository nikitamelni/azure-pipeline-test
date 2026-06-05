// All configuration is read once at module load. Failing fast here means a
// misconfigured Function App surfaces the error in cold-start logs rather than
// silently misbehaving on every invocation.

const required = (name: string): string => {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
};

const optional = (name: string, fallback: string): string => process.env[name] ?? fallback;

const parseJsonOptional = <T>(name: string, fallback: T): T => {
  const raw = process.env[name];
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    throw new Error(`Env var ${name} is not valid JSON: ${(err as Error).message}`);
  }
};

export interface AppConfig {
  uniform: {
    projectId: string;
    apiKey: string;
    apiBase: string;
    appBase: string;
  };
  storage: {
    connectionString: string;
    blobContainer: string;
    tableByTag: string;
  };
  /**
   * Optional Azure Front Door purge configuration. When all three values are
   * set, every blob write is followed by a purge of the matching path so the
   * CDN edge never serves stale content. When any value is missing, the Front
   * Door step is skipped (typical when the app reads blobs directly from
   * storage with `Cache-Control: no-cache`).
   */
  frontDoor: {
    subscriptionId?: string;
    resourceGroup?: string;
    profileName?: string;
    endpointName?: string;
  };
  mirror: {
    rateLimitRps: number;
    /** Map of `:placeholder` route segment name → Uniform entry `type`. */
    dynamicExpansions: Record<string, string>;
    /**
     * Locale prefixes the seed should prepend to project map template paths.
     * The catch-all in the Next.js app uses a single `/en` prefix today; if
     * you later go multi-locale, list each locale here.
     */
    localePrefixes: string[];
    seedTimerCron: string;
  };
}

export const config: AppConfig = {
  uniform: {
    projectId: required('UNIFORM_PROJECT_ID'),
    apiKey: required('UNIFORM_API_KEY'),
    apiBase: optional('UNIFORM_API_BASE', 'https://uniform.global'),
    appBase: optional('UNIFORM_APP_BASE', 'https://uniform.app'),
  },
  storage: {
    connectionString: required('MIRROR_STORAGE_CONNECTION'),
    blobContainer: optional('MIRROR_BLOB_CONTAINER', 'edge-mirror'),
    tableByTag: optional('MIRROR_TABLE_BY_TAG', 'byTag'),
  },
  frontDoor: {
    subscriptionId: process.env.AFD_SUBSCRIPTION_ID,
    resourceGroup: process.env.AFD_RESOURCE_GROUP,
    profileName: process.env.AFD_PROFILE_NAME,
    endpointName: process.env.AFD_ENDPOINT_NAME,
  },
  mirror: {
    rateLimitRps: Math.max(1, Number(optional('MIRROR_RATE_LIMIT_RPS', '5'))),
    dynamicExpansions: parseJsonOptional<Record<string, string>>('MIRROR_DYNAMIC_EXPANSIONS', {}),
    localePrefixes: parseJsonOptional<string[]>('MIRROR_LOCALE_PREFIXES', ['en']),
    seedTimerCron: optional('MIRROR_SEED_TIMER_CRON', '0 0 */6 * * *'),
  },
};

/** True iff all four AFD fields are present — used to gate CDN purge calls. */
export const isFrontDoorConfigured = (): boolean =>
  !!(
    config.frontDoor.subscriptionId &&
    config.frontDoor.resourceGroup &&
    config.frontDoor.profileName &&
    config.frontDoor.endpointName
  );

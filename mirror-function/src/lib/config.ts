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
  mirror: {
    rateLimitRps: number;
    defaultLocale: string;
    /** Map of `:placeholder` route segment name → Uniform entry `type`. */
    dynamicExpansions: Record<string, string>;
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
  mirror: {
    rateLimitRps: Math.max(1, Number(optional('MIRROR_RATE_LIMIT_RPS', '5'))),
    defaultLocale: optional('MIRROR_LOCALE_DEFAULT', 'en'),
    dynamicExpansions: parseJsonOptional<Record<string, string>>('MIRROR_DYNAMIC_EXPANSIONS', {}),
    seedTimerCron: optional('MIRROR_SEED_TIMER_CRON', '0 0 */6 * * *'),
  },
};

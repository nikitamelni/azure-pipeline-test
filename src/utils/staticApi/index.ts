// Public surface of the static-API integration.
//
// Typical usage in the Next.js app:
//
//   import { createStaticApiFetch, resolveStaticApiConfig } from '@/utils/staticApi';
//
//   const staticApi = resolveStaticApiConfig();
//   const routeFetch = staticApi ? createStaticApiFetch(staticApi) : undefined;
//
//   new RouteClient({
//     apiKey: process.env.UNIFORM_API_KEY,
//     projectId: process.env.UNIFORM_PROJECT_ID,
//     fetch: routeFetch,
//   });
//
// When `resolveStaticApiConfig` returns null (env var absent), the SDK keeps
// calling uniform.global directly. This is the safe default for local dev /
// preview where no mirror is provisioned.

export { base64urlEncode } from './encoding';
export { createStaticApiFetch, type StaticApiFetchOptions } from './createFetch';

/**
 * Read the static-API env vars and return a ready-to-use config, or null when
 * the integration is disabled. Looks at both the public (browser-exposed) and
 * server-side variants of the base URL so the override can run on either
 * side of the SSR/CSR boundary.
 */
export const resolveStaticApiConfig = (): {
  baseUrl: string;
  projectId: string;
} | null => {
  const baseUrl =
    process.env.NEXT_PUBLIC_UNIFORM_STATIC_API_BASE_URL ||
    process.env.UNIFORM_STATIC_API_BASE_URL;
  const projectId = process.env.UNIFORM_PROJECT_ID;
  if (!baseUrl || !projectId) return null;
  return { baseUrl, projectId };
};

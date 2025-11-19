import { NextRouter } from 'next/router';
import { ResolvedRouteGetResponse, RouteGetResponseEdgehancedComposition, LinkParamValue } from '@uniformdev/canvas';

/**
 * Replaces dynamic segments in an unresolved path template (with `:tokens`)
 * using values from a resolved path.
 *
 * If the structure doesn't match, returns `undefined` instead of throwing an error.
 *
 * @param {string} unresolved - The path template containing dynamic segments (e.g. `/:locale/:dynamic/static`).
 * @param {string} resolved - The fully resolved path with actual values (e.g. `/en/test/static`).
 * @returns {string | undefined} - The final path with dynamic tokens replaced (e.g. `/en/test/static`), or `undefined` on mismatch.
 *
 * @example
 * resolveRouteToPath("/:locale/:dynamic", "/en/test");
 * // Returns: "/en/test"
 *
 * @example
 * resolveRouteToPath("/:locale/:dynamic/static/:dynamic", "/en/test/static/foo");
 * // Returns: "/en/test/static/foo"
 *
 * @example
 * resolveRouteToPath("/:locale/static", "/en/test");
 * // Returns: undefined
 */
export const resolveRouteToPath = (unresolved: string, resolved: string): string | undefined => {
  const unresolvedParts = unresolved.split('/').filter(Boolean);
  const resolvedParts = resolved.split('/').filter(Boolean);

  if (resolvedParts.length < unresolvedParts.length) {
    return undefined;
  }

  const { valid, result } = unresolvedParts.reduce<{
    valid: boolean;
    result: string[];
    index: number;
  }>(
    (acc, part) => {
      if (!acc.valid) return acc;
      const currentResolved = resolvedParts[acc.index];
      if (!currentResolved) return { ...acc, valid: false };

      if (part.startsWith(':')) {
        return {
          ...acc,
          result: [...acc.result, currentResolved],
          index: acc.index + 1,
        };
      }

      if (part === currentResolved) {
        return {
          ...acc,
          result: [...acc.result, part],
          index: acc.index + 1,
        };
      }

      return { ...acc, valid: false };
    },
    { valid: true, result: [], index: 0 }
  );

  return valid ? '/' + result.join('/') : undefined;
};

/**
 * Checks if a given route response is free of errors and contains a composition.
 *
 * @param {ResolvedRouteGetResponse} route - The route response to check.
 * @returns {boolean} - True if the route contains a valid composition, otherwise false.
 */
export const isRouteWithoutErrors = (route: ResolvedRouteGetResponse): route is RouteGetResponseEdgehancedComposition =>
  'compositionApiResponse' in route && !!route.compositionApiResponse && 'composition' in route.compositionApiResponse;

/**
 * Formats a Uniform link into a URL or mailto link based on its type.
 *
 * @param {LinkParamValue | undefined} uniformLink - The Uniform link to format.
 * @returns {string} - The formatted link as a string.
 */
export const formatUniformLink = (uniformLink?: LinkParamValue): string => {
  if (!uniformLink) return '';

  if (uniformLink.type === 'email') {
    return `mailto:${uniformLink.path}`;
  }

  return uniformLink.path;
};

/**
 * Determines if a given link is an external URL.
 *
 * @param {string} href - The URL or link to evaluate.
 * @returns {boolean} - True if the link starts with "http", indicating it is an external link; otherwise, false.
 */
export const isExternalLink = (href?: string): boolean => href?.startsWith('http') ?? false;

export const checkIsCurrentRoute = (router: NextRouter, link: LinkParamValue) => {
  if (!link) return false;
  const { asPath } = router;
  const localeFromLink = 'dynamicInputValues' in link ? link.dynamicInputValues?.locale : undefined;
  const [pathWithoutQuery] = asPath.split('?');
  const linkPath = link.path === '/' ? link.path : link.path.replace(/\/$/, '');
  return pathWithoutQuery === (localeFromLink ? linkPath.replace(`/${localeFromLink}`, '') : linkPath);
};

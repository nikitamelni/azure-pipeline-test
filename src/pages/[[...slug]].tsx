import {
  CANVAS_DRAFT_STATE,
  CANVAS_PUBLISHED_STATE,
  createUniformApiEnhancer,
  RootComponentInstance,
  RouteClient,
} from '@uniformdev/canvas';
import { withUniformGetStaticProps } from '@uniformdev/canvas-next/route';
import { UniformComposition } from '@uniformdev/canvas-react';
import { BreadcrumbsContextProvider } from '@uniformdev/csk-components/components/canvas';
import {
  DesignExtensionsProvider,
  type DesignExtensionsProviderProps,
} from '@uniformdev/design-extensions-tools/components/providers/server';
import { getTokenConfiguration } from '@uniformdev/design-extensions-tools/getTokenConfiguration';
import { componentResolver } from '@/components';
import { getBreadcrumbs, buildPath, getProjectMapClient } from '@/utils/canvas/canvasClients';
import { getContentClient } from '@/utils/contentClient';
import { createStaticApiFetch, resolveStaticApiConfig } from '@/utils/staticApi';

// When UNIFORM_STATIC_API_BASE_URL is set, RouteClient calls are redirected to
// the Azure mirror via a fetch override (base64url(path)-keyed blob in
// Storage/Front Door). When unset (dev, preview/SSR without the mirror) the
// SDK falls back to https://uniform.global, keeping draft/preview on the live
// edge. The override is /api/v1/route-only — entries, project-map, and
// canvas-by-id continue to hit uniform.global directly.
const staticApi = resolveStaticApiConfig();
const routeFetch = staticApi ? createStaticApiFetch(staticApi) : undefined;

export const getStaticProps = withUniformGetStaticProps({
  modifyPath: (path: string) => {
    return '/en' + path;
  },
  client: new RouteClient({
    apiKey: process.env.UNIFORM_API_KEY,
    projectId: process.env.UNIFORM_PROJECT_ID,
    disableSWR: true,
    ...(routeFetch ? { fetch: routeFetch } : {}),
  }),
  param: 'slug',
  handleComposition: async (routeResponse, _context) => {
    const { composition, errors } = routeResponse.compositionApiResponse || {};

    if (errors?.some(e => e.type === 'data' || e.type === 'binding')) {
      return { notFound: true };
    }
    const preview = Boolean(_context.preview);
    const tokenConfiguration = !preview && process.env.WATCH !== 'true' ? null : await getTokenConfiguration();

    const breadcrumbs = await getBreadcrumbs(
      composition,
      buildPath(routeResponse.matchedRoute, routeResponse.dynamicInputs)
    );

    return {
      props: { preview, data: composition || null, tokenConfiguration, breadcrumbs },
    };
  },
});

export const getStaticPaths = async () => {
  const { nodes } = await getProjectMapClient().getNodes({
    state: process.env.NODE_ENV === 'development' ? CANVAS_DRAFT_STATE : CANVAS_PUBLISHED_STATE,
  });

  const paths =
    nodes?.reduce((acc: string[], { path, type }) => (type === 'composition' ? [...acc, path] : acc), []) || [];
  // removing locale from the path to match the original site structure
  const pathsWithLocale = paths.map(path => path.replace('/:locale', ''));

  // replacing the dynamic locaiton details with the actual location details
  // getting all possible location to pre-render them. location are stored in Uniform as entries

  const contentClient = getContentClient();

  const locationsResponse = await contentClient.getEntries({
    filters: {
      type: { eq: 'location' },
    },
    limit: 20,
  });

  const locations = (locationsResponse?.entries?.map(entry => entry?.entry?._slug) || []) as string[];

  const pathsWithLocationDetails = pathsWithLocale.flatMap(path => {
    if (path.includes(':location')) {
      return locations.map((location: string) => path.replace(':location', location));
    }
    return path;
  });

  return {
    paths: pathsWithLocationDetails,
    fallback: 'blocking',
  };
};

type PageProps = {
  data: RootComponentInstance;
  preview: boolean;
  breadcrumbs: { title: string; link: string | null }[];
} & Pick<DesignExtensionsProviderProps, 'tokenConfiguration'>;

export default function Page({ data, tokenConfiguration, breadcrumbs, preview }: PageProps) {
  return (
    <DesignExtensionsProvider tokenConfiguration={tokenConfiguration} isPreviewMode={preview}>
      <BreadcrumbsContextProvider breadcrumbs={breadcrumbs}>
        <UniformComposition
          data={data}
          behaviorTracking="onLoad"
          contextualEditingEnhancer={createUniformApiEnhancer({ apiUrl: '/api/preview' })}
          resolveRenderer={componentResolver}
        />
      </BreadcrumbsContextProvider>
    </DesignExtensionsProvider>
  );
}

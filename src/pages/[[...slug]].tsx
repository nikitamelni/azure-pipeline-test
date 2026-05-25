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

// UNIFORM_API_HOST is intended to be set by the static-export pipeline to point
// at the Uniform edge mirror (an Azure Function fronting a blob-storage cache).
// When unset (dev, preview/SSR), RouteClient falls back to its SDK default
// (https://uniform.global), keeping draft/preview flows on the live edge.
const ROUTE_CLIENT_API_HOST = process.env.UNIFORM_API_HOST;

export const getStaticProps = withUniformGetStaticProps({
  modifyPath: (path: string) => {
    return '/en' + path;
  },
  client: new RouteClient({
    apiKey: process.env.UNIFORM_API_KEY,
    projectId: process.env.UNIFORM_PROJECT_ID,
    disableSWR: true,
    ...(ROUTE_CLIENT_API_HOST ? { apiHost: ROUTE_CLIENT_API_HOST } : {}),
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

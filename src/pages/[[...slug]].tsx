import { CanvasClient, createUniformApiEnhancer, flattenValues, RootComponentInstance } from '@uniformdev/canvas';
import { prependLocale, withUniformGetServerSideProps } from '@uniformdev/canvas-next/route';
import { UniformComposition } from '@uniformdev/canvas-react';
import { BreadcrumbsContextProvider } from '@uniformdev/csk-components/components/canvas';
import { resolveRouteToPath } from '@uniformdev/csk-components/utils/routing';
import {
  DesignExtensionsProvider,
  type DesignExtensionsProviderProps,
} from '@uniformdev/design-extensions-tools/components/providers/server';
import { getTokenConfiguration } from '@uniformdev/design-extensions-tools/getTokenConfiguration';
import { ProjectMapClient } from '@uniformdev/project-map';
import { componentResolver } from '@/components';

const buildPath = (matchedRoute: string, dynamicInputs: Record<string, string | number> | undefined): string => {
  let path = matchedRoute;
  for (const [key, value] of Object.entries(dynamicInputs ?? {})) {
    path = path.replace(`:${key}`, String(value));
  }
  return path;
};

const hasAutoGenerateTrue = (data: RootComponentInstance, type: string, param: string) => {
  const seen = new WeakSet();
  let result = false;

  (function walk(node) {
    if (result || node == null || typeof node !== 'object' || seen.has(node)) return;
    seen.add(node);
    if (node.type === type) {
      const value = node.parameters?.[param]?.value ?? node.parameters?.[param];
      if (value === true) {
        result = true;
        return;
      }
    }
    if (Array.isArray(node)) {
      for (const item of node) {
        if (result) break;
        walk(item);
      }
    } else {
      for (const val of Object.values(node)) {
        if (result) break;
        walk(val as RootComponentInstance);
      }
    }
  })(data);

  return result;
};

const getBreadcrumbs = async (composition: RootComponentInstance, path: string) => {
  if (composition.type !== 'page' || !hasAutoGenerateTrue(composition, 'breadcrumbs', 'autoGenerate')) return [];
  const client = new ProjectMapClient({
    projectId: process.env.UNIFORM_PROJECT_ID,
    apiKey: process.env.UNIFORM_API_KEY,
  });

  const { projectMapNodes } = composition;
  if (!projectMapNodes || !projectMapNodes[0]) return [];

  const { nodes } = await client.getNodes({
    path: projectMapNodes[0].path,
    includeAncestors: true,
    depth: 0,
  });

  if (!nodes?.length) return [];

  return Promise.all(
    nodes.map(async node => {
      const isDynamic = node.pathSegment?.includes(':');

      const title =
        isDynamic && node.compositionId
          ? await new CanvasClient({
              projectId: process.env.UNIFORM_PROJECT_ID,
              apiKey: process.env.UNIFORM_API_KEY,
            })
              .getCompositionById({ compositionId: node.compositionId })
              .then(({ composition }) => {
                if (!composition) return node.name;
                const flattened = flattenValues(composition);
                return (flattened?.pageTitle as string) || node.name;
              })
              .catch(() => node.name)
          : node.name;

      const link = node.type === 'placeholder' ? null : resolveRouteToPath(node.path, path);

      return { title, link };
    })
  );
};

export const getServerSideProps = withUniformGetServerSideProps({
  modifyPath: prependLocale,
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

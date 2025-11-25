import { CanvasClient, RootComponentInstance } from '@uniformdev/canvas';
import { flattenValues } from '@uniformdev/canvas';
import { resolveRouteToPath } from '@uniformdev/csk-components/utils/routing';
import { ProjectMapClient } from '@uniformdev/project-map';

export const getProjectMapClient = () => {
  const apiKey = process.env.UNIFORM_API_KEY;
  const apiHost = process.env.UNIFORM_CLI_BASE_URL || 'https://uniform.app';
  const projectId = process.env.UNIFORM_PROJECT_ID;

  if (!apiHost) throw new Error('apiHost is not specified. Project Map client cannot be instantiated');

  if (!projectId) throw new Error('projectId is not specified. Project Map client cannot be instantiated');

  return new ProjectMapClient({
    apiKey,
    apiHost,
    projectId,
  });
};

export const buildPath = (matchedRoute: string, dynamicInputs: Record<string, string | number> | undefined): string => {
  let path = matchedRoute;
  for (const [key, value] of Object.entries(dynamicInputs ?? {})) {
    path = path.replace(`:${key}`, String(value));
  }
  return path;
};

export const hasAutoGenerateTrue = (data: RootComponentInstance, type: string, param: string) => {
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

export const getBreadcrumbs = async (composition: RootComponentInstance, path: string) => {
  if (composition.type !== 'page' || !hasAutoGenerateTrue(composition, 'breadcrumbs', 'autoGenerate')) return [];
  const client = getProjectMapClient();

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

import { SVGProps } from 'react';

type SVGAttributes = Record<string, string | number | boolean>;
type ReactSVGProps = SVGProps<SVGSVGElement>;
const PRESERVE_AS_STRING = ['id', 'class', 'viewBox', 'preserveAspectRatio'];

const ATTRIBUTE_MAP: Record<string, string> = {
  class: 'className',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-opacity': 'strokeOpacity',
  'fill-opacity': 'fillOpacity',
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  'clip-path': 'clipPath',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  'text-anchor': 'textAnchor',
  'pointer-events': 'pointerEvents',
  'vector-effect': 'vectorEffect',
  'color-interpolation': 'colorInterpolation',
  'dominant-baseline': 'dominantBaseline',
  'text-rendering': 'textRendering',
  'shape-rendering': 'shapeRendering',
  'color-rendering': 'colorRendering',
  'image-rendering': 'imageRendering',
  'xml:space': 'xmlSpace',
  'xmlns:xlink': 'xmlnsXlink',
} as const;

/**
 * Sanitizes SVG by removing potentially dangerous or unwanted content.
 */
export const sanitizeSvg = (svg: string): string =>
  svg
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');

/**
 * Replaces color attributes (fill, stroke, color) with `currentColor`
 * except for 'none' and 'transparent'.
 */
export const applyCurrentColor = (svg: string): string =>
  svg
    .replace(/fill=(['"])(?!none|transparent)[^'"]*\1/gi, 'fill="currentColor"')
    .replace(/stroke=(['"])(?!none|transparent)[^'"]*\1/gi, 'stroke="currentColor"')
    .replace(/color=(['"])[^'"]*\1/gi, 'color="currentColor"');

/**
 * Extracts attributes from the <svg> tag as key-value pairs.
 */
export const getSvgAttributes = (svgContent: string): SVGAttributes => {
  const svgTagMatch = svgContent.match(/<svg([^>]*)>/i);
  if (!svgTagMatch) return {};

  const attributesString = svgTagMatch[1];
  const attributes: SVGAttributes = {};

  const attrRegex = /(\w+(?:[-:]\w+)*)\s*=\s*["']([^"']*)["']/g;
  let match;

  while ((match = attrRegex.exec(attributesString ?? '')) !== null) {
    const [, key, value] = match;

    if (!key || !value) continue;

    if (value === 'true' || value === 'false') {
      attributes[key] = value === 'true';
    } else if (!isNaN(Number(value)) && value !== '' && !PRESERVE_AS_STRING.includes(key)) {
      attributes[key] = Number(value);
    } else {
      attributes[key] = value;
    }
  }

  return attributes;
};
/**
 * Extracts inner content from an SVG string (everything inside <svg>...</svg>).
 */
export const getSvgInnerContent = (svg: string): string => {
  const match = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  return match?.[1] ?? '';
};

/**
 * Converts SVG attributes to React props.
 */
export const convertSvgAttributesToReactProps = (attributes: SVGAttributes): Partial<ReactSVGProps> => {
  const reactProps: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(attributes)) {
    const reactPropName = ATTRIBUTE_MAP[key] || key;
    reactProps[reactPropName] = value;
  }

  return reactProps;
};

/**
 * Fetches raw SVG content from a remote URL.
 */
export const fetchSvg = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'image/svg+xml, text/plain, */*',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch SVG: ${response.status} ${response.statusText}`);
    }

    const content = await response.text();
    if (!content.trim().includes('<svg')) {
      throw new Error('Response is not valid SVG');
    }

    return content;
  } catch (err) {
    console.error('Error fetching SVG:', err);
    throw err;
  }
};

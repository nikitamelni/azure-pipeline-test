import { FC, SVGProps, useEffect, useState } from 'react';
import { cn } from '@/utils/styling';
import { InlineSVGProps } from '.';
import {
  fetchSvg,
  sanitizeSvg,
  applyCurrentColor,
  getSvgAttributes,
  getSvgInnerContent,
  convertSvgAttributesToReactProps,
} from './utils';

export const InlineSVG: FC<InlineSVGProps> = ({
  src,
  className = '',
  width,
  height,
  fill,
  sanitize = true,
  useCurrentColor = true,
  fallback,
  alt,
}) => {
  const [raw, setRaw] = useState<string | null>(null);
  useEffect(() => {
    const run = async () => {
      const raw = await fetchSvg(src);
      setRaw(raw);
    };
    run();
  }, [src]);

  if (!src || !raw) return fallback ?? null;

  const transformSvg = (svg: string): string => {
    const transformers: Array<(input: string) => string> = [];

    if (sanitize) transformers.push(sanitizeSvg);
    if (useCurrentColor) transformers.push(applyCurrentColor);

    return transformers.reduce((result, fn) => fn(result), svg);
  };

  try {
    const cleaned = transformSvg(raw);
    const attrs = getSvgAttributes(cleaned);
    const content = getSvgInnerContent(cleaned);

    const reactProps = convertSvgAttributesToReactProps(attrs);

    const svgProps: SVGProps<SVGSVGElement> = {
      ...reactProps,
      role: 'img',
      'aria-label': alt,
      focusable: false,
      width: fill ? '100%' : width,
      height: fill ? '100%' : height,
      className: cn(reactProps.className, className, {
        'absolute inset-0': fill,
      }),
    };

    return (
      <div className="relative size-full">
        <svg {...svgProps} dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  } catch {
    return (
      fallback ?? (
        <div className={cn(className)} style={{ width, height }}>
          <div className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-500">Failed to load SVG</div>
        </div>
      )
    );
  }
};

import { CSSProperties, FC } from 'react';
import { LinkParamValue } from '@uniformdev/canvas';
import { ComponentProps, UniformSlot, UniformText } from '@uniformdev/canvas-react';
import { SpaceType, ViewPort } from '@uniformdev/csk-components/types/cskTypes';
import { formatUniformLink } from '@uniformdev/csk-components/utils/routing';
import { formatSpaceParameterValue, resolveViewPort } from '@uniformdev/csk-components/utils/styling';
import { cn } from '@/utils/styling';

export type PfgCarouselParameters = {
  displayName?: string;
  title?: string;
  description?: string;
  ctaLink?: LinkParamValue;
  ctaText?: string;
  spacing?: SpaceType | ViewPort<SpaceType>;
};

enum PfgCarouselSlots {
  Items = 'items',
}

type PfgCarouselProps = ComponentProps<PfgCarouselParameters>;

const PfgCarousel: FC<PfgCarouselProps> = ({ ctaLink, ctaText, spacing }) => {
  const [staticSpacing, dynamicSpacing] = formatSpaceParameterValue(spacing);
  const href = formatUniformLink(ctaLink);

  const containerClasses = cn(
    'mx-auto max-w-7xl px-6 py-12',
    resolveViewPort(dynamicSpacing.paddingTop, 'pt-[{value}]'),
    resolveViewPort(dynamicSpacing.paddingBottom, 'pb-[{value}]'),
    resolveViewPort(dynamicSpacing.marginTop, 'mt-[{value}]'),
    resolveViewPort(dynamicSpacing.marginBottom, 'mb-[{value}]')
  );
  const inlineStyles: CSSProperties = { ...staticSpacing };

  return (
    <section className="w-full bg-gray-900 text-white">
      <div className={containerClasses} style={inlineStyles}>
        <div className="mb-8 flex flex-col gap-2 text-center">
          <UniformText
            parameterId="title"
            as="h2"
            className="text-3xl font-bold md:text-4xl"
            placeholder="Carousel title"
          />
          <UniformText parameterId="description" as="p" className="text-base" placeholder="Description" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          <UniformSlot name={PfgCarouselSlots.Items} />
        </div>
        {href && ctaText && (
          <div className="mt-8 flex justify-center">
            <a
              href={href}
              className="inline-flex items-center justify-center rounded bg-red-700 px-6 py-3 text-base font-semibold text-white hover:bg-red-800"
            >
              {ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default PfgCarousel;

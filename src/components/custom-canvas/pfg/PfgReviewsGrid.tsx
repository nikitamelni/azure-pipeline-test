import { CSSProperties, FC } from 'react';
import { ComponentProps, UniformSlot } from '@uniformdev/canvas-react';
import { SpaceType, ViewPort } from '@uniformdev/csk-components/types/cskTypes';
import { formatSpaceParameterValue, resolveViewPort } from '@uniformdev/csk-components/utils/styling';
import { cn } from '@/utils/styling';

export type PfgReviewsGridParameters = {
  displayName?: string;
  columnsCount?: ViewPort<string> | string;
  gapX?: ViewPort<string> | string;
  gapY?: ViewPort<string> | string;
  alignItems?: ViewPort<string> | string;
  backgroundColor?: string;
  spacing?: SpaceType | ViewPort<SpaceType>;
  border?: string;
  fluidContent?: boolean;
  height?: ViewPort<string> | string;
};

enum PfgReviewsGridSlots {
  Body = 'body',
}

type PfgReviewsGridProps = ComponentProps<PfgReviewsGridParameters>;

const PfgReviewsGrid: FC<PfgReviewsGridProps> = ({
  columnsCount,
  gapX,
  gapY,
  alignItems,
  backgroundColor,
  spacing,
  fluidContent,
}) => {
  const [staticSpacing, dynamicSpacing] = formatSpaceParameterValue(spacing);

  const gridClasses = cn(
    'grid w-full',
    {
      [`bg-${backgroundColor}`]: backgroundColor,
    },
    resolveViewPort(columnsCount, 'grid-cols-{value}'),
    resolveViewPort(gapX, 'gap-x-[{value}px]'),
    resolveViewPort(gapY, 'gap-y-[{value}px]'),
    resolveViewPort(alignItems, 'items-{value}'),
    resolveViewPort(dynamicSpacing.paddingTop, 'pt-[{value}]'),
    resolveViewPort(dynamicSpacing.paddingBottom, 'pb-[{value}]'),
    resolveViewPort(dynamicSpacing.paddingLeft, 'pl-[{value}]'),
    resolveViewPort(dynamicSpacing.paddingRight, 'pr-[{value}]'),
    resolveViewPort(dynamicSpacing.marginTop, 'mt-[{value}]'),
    resolveViewPort(dynamicSpacing.marginBottom, 'mb-[{value}]')
  );
  const inlineStyles: CSSProperties = { ...staticSpacing };

  return (
    <div className={cn('w-full px-6 py-8', { 'max-w-7xl mx-auto': !fluidContent })}>
      <div className={gridClasses} style={inlineStyles}>
        <UniformSlot name={PfgReviewsGridSlots.Body} />
      </div>
    </div>
  );
};

export default PfgReviewsGrid;

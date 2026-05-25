import { CSSProperties, FC } from 'react';
import { ComponentProps, UniformSlot } from '@uniformdev/canvas-react';
import { SpaceType, ViewPort } from '@uniformdev/csk-components/types/cskTypes';
import { formatSpaceParameterValue, resolveViewPort } from '@uniformdev/csk-components/utils/styling';
import { cn } from '@/utils/styling';

export type PfgCardsParameters = {
  displayName?: string;
  direction?: ViewPort<string> | string;
  justifyContent?: ViewPort<string> | string;
  gap?: ViewPort<string> | string;
  alignItems?: ViewPort<string> | string;
  wrap?: string;
  backgroundColor?: string;
  spacing?: SpaceType | ViewPort<SpaceType>;
  border?: string;
  fluidContent?: boolean;
  height?: ViewPort<string> | string;
};

enum PfgCardsSlots {
  Body = 'body',
  FooterButton = 'footerButton',
}

type PfgCardsProps = ComponentProps<PfgCardsParameters>;

const PfgCards: FC<PfgCardsProps> = ({
  direction,
  justifyContent,
  gap,
  alignItems,
  wrap,
  backgroundColor,
  spacing,
  fluidContent,
}) => {
  const [staticSpacing, dynamicSpacing] = formatSpaceParameterValue(spacing);

  const containerClasses = cn(
    'flex w-full',
    {
      [`bg-${backgroundColor}`]: backgroundColor,
      [`flex-${wrap === 'nowrap' ? 'nowrap' : 'wrap'}`]: wrap,
    },
    resolveViewPort(direction, 'flex-{value}'),
    resolveViewPort(justifyContent, 'justify-{value}'),
    resolveViewPort(alignItems, 'items-{value}'),
    resolveViewPort(gap, 'gap-[{value}px]'),
    resolveViewPort(dynamicSpacing.paddingTop, 'pt-[{value}]'),
    resolveViewPort(dynamicSpacing.paddingBottom, 'pb-[{value}]'),
    resolveViewPort(dynamicSpacing.paddingLeft, 'pl-[{value}]'),
    resolveViewPort(dynamicSpacing.paddingRight, 'pr-[{value}]'),
    resolveViewPort(dynamicSpacing.marginTop, 'mt-[{value}]'),
    resolveViewPort(dynamicSpacing.marginBottom, 'mb-[{value}]')
  );

  const inlineStyles: CSSProperties = { ...staticSpacing };

  return (
    <div className={cn('w-full px-6', { 'max-w-7xl mx-auto': !fluidContent })}>
      <div className={containerClasses} style={inlineStyles}>
        <UniformSlot name={PfgCardsSlots.Body} />
      </div>
      <div className="mt-6 flex justify-center">
        <UniformSlot name={PfgCardsSlots.FooterButton} />
      </div>
    </div>
  );
};

export default PfgCards;

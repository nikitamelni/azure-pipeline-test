import { FC } from 'react';
import Container from '@/components/ui/Container';
import { cn } from '@/utils/styling';
import { DemoHeroVariants, FlexibleHeroParameters } from '.';

type ColumnsVariantProps = {
  backgroundColor: FlexibleHeroParameters['backgroundColor'];
  spacing: FlexibleHeroParameters['spacing'];
  border: FlexibleHeroParameters['border'];
  fluidContent: FlexibleHeroParameters['fluidContent'];
  height: FlexibleHeroParameters['height'];
  variant?: DemoHeroVariants;
  demoHeroMedia: React.ReactNode;
  demoHeroContent: React.ReactNode;
  demoHeroCTA: React.ReactNode;
  textAlignmentClass: string;
  buttonAlignmentClass: string;
};

export const ColumnsVariant: FC<ColumnsVariantProps> = ({
  backgroundColor,
  spacing,
  border,
  fluidContent,
  height,
  variant,
  demoHeroMedia,
  demoHeroContent,
  demoHeroCTA,
  textAlignmentClass,
  buttonAlignmentClass,
}) => (
  <Container {...{ backgroundColor, spacing, border, fluidContent, height }}>
    <div className={cn('grid grid-cols-1 items-center gap-4 px-4 lg:grid-cols-2 xl:px-0')}>
      <div className={cn('aspect-square', { 'order-last': variant === DemoHeroVariants.ColumnsReverse })}>
        <div className="flex size-full items-center justify-center overflow-hidden">{demoHeroMedia}</div>
      </div>
      <div className="flex flex-col justify-center gap-8">
        <div className={cn('flex flex-col gap-4', textAlignmentClass)}>{demoHeroContent}</div>
        <div className={cn('flex flex-wrap gap-2 items-center', buttonAlignmentClass)}>{demoHeroCTA}</div>
      </div>
    </div>
  </Container>
);

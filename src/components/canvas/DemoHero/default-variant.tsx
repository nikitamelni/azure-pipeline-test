import { FC } from 'react';
import Container from '@/components/ui/Container';
import { cn } from '@/utils/styling';
import { FlexibleHeroParameters } from '.';

type DefaultVariantProps = {
  backgroundColor: FlexibleHeroParameters['backgroundColor'];
  spacing: FlexibleHeroParameters['spacing'];
  border: FlexibleHeroParameters['border'];
  fluidContent: FlexibleHeroParameters['fluidContent'];
  height: FlexibleHeroParameters['height'];
  demoHeroMedia: React.ReactNode;
  demoHeroContent: React.ReactNode;
  demoHeroCTA: React.ReactNode;
  textAlignmentClass: string;
  buttonAlignmentClass: string;
};

export const DefaultVariant: FC<DefaultVariantProps> = ({
  backgroundColor,
  spacing,
  border,
  fluidContent,
  height,
  demoHeroMedia,
  demoHeroContent,
  demoHeroCTA,
  textAlignmentClass,
  buttonAlignmentClass,
}) => (
  <Container className="relative overflow-hidden" {...{ backgroundColor, spacing, border, fluidContent, height }}>
    <div className="absolute left-0 top-0 size-full overflow-hidden">{demoHeroMedia}</div>
    <Container className="relative flex flex-col gap-8">
      <div className={cn('flex flex-col gap-4', textAlignmentClass)}>{demoHeroContent}</div>
      <div className={cn('flex flex-wrap gap-2 items-center', buttonAlignmentClass)}>{demoHeroCTA}</div>
    </Container>
  </Container>
);

import { FC } from 'react';
import Container from '@/components/ui/Container';
import { cn } from '@/utils/styling';
import { SectionParameters, SectionVariants } from '.';

type ColumnsVariantProps = {
  backgroundColor: SectionParameters['backgroundColor'];
  spacing: SectionParameters['spacing'];
  border: SectionParameters['border'];
  fluidContent: SectionParameters['fluidContent'];
  height: SectionParameters['height'];
  variant: SectionVariants;
  sectionMedia: React.ReactNode;
  sectionContent: React.ReactNode;
  sectionCTA: React.ReactNode;
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
  sectionMedia,
  sectionContent,
  sectionCTA,
  textAlignmentClass,
  buttonAlignmentClass,
}) => (
  <Container {...{ backgroundColor, spacing, border, fluidContent, height }}>
    <div className={cn('grid grid-cols-1 items-center gap-4 px-4 lg:grid-cols-2 xl:px-0')}>
      <div className={cn('aspect-square', { 'order-last': variant === SectionVariants.ColumnsReverse })}>
        <div className="flex size-full items-center justify-center overflow-hidden">{sectionMedia}</div>
      </div>
      <div className="flex flex-col justify-center gap-8">
        <div className={cn('flex flex-col gap-4', textAlignmentClass)}>{sectionContent}</div>
        <div className={cn('flex flex-wrap gap-2', buttonAlignmentClass)}>{sectionCTA}</div>
      </div>
    </div>
  </Container>
);

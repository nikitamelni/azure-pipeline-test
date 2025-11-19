import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import Container from '@/components/ui/Container';
import { cn } from '@/utils/styling';
import { CardProps, CardSlots, CardVariants } from '.';

const Card: FC<CardProps> = ({
  backgroundColor,
  spacing,
  border,
  fluidContent,
  height,
  className,
  contentClassName,
  component,
}) => {
  const variant = component.variant as CardVariants;
  const isBackgroundImageVariant = variant === CardVariants.BackgroundImage;

  return (
    <Container
      className={cn('relative overflow-hidden', className)}
      {...{ backgroundColor, spacing, border, fluidContent, height }}
    >
      <div
        className={cn({
          'inset-0 size-full absolute': isBackgroundImageVariant,
        })}
      >
        <UniformSlot name={CardSlots.CardMedia} emptyPlaceholder={null} />
      </div>
      <div className={cn('relative flex flex-col gap-y-2', contentClassName)}>
        <UniformSlot name={CardSlots.CardContent} emptyPlaceholder={<div className="h-20" />} />
      </div>
    </Container>
  );
};

export default Card;

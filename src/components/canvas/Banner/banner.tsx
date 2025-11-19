import { FC, useCallback, useState } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import Container from '@/components/ui/Container';
import { cn } from '@/utils/styling';
import { ContentAlignment, BannerProps, BannerSlots } from '.';
import CloseButton from './close-button';
import { getContentClasses, getPositionClasses } from './style-utils';
import { BannerVariants } from './types';

const Banner: FC<BannerProps> = ({
  backgroundColor,
  spacing,
  border,
  fluidContent,
  iconColor,
  contentAlignment = ContentAlignment.Center,
  floating = false,
  component,
}) => {
  const variant = component.variant as BannerVariants;
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  if (!isOpen) return null;

  const positionClasses = getPositionClasses({ variant: variant as BannerVariants, floating });
  const contentClasses = getContentClasses({ contentAlignment, iconColor, fluidContent, floating });

  return (
    <Container className={positionClasses} fluidContent={fluidContent} border={border}>
      <Container
        className={cn('relative w-full', contentClasses)}
        backgroundColor={backgroundColor}
        spacing={spacing}
        fluidContent={fluidContent}
      >
        <UniformSlot name={BannerSlots.BannerContent} emptyPlaceholder={<div className="h-20 w-full" />} />
        {iconColor && <CloseButton onClose={handleClose} iconColor={iconColor} />}
      </Container>
    </Container>
  );
};

export default Banner;

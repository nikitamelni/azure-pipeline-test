import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import BaseCarousel from '@/components/ui/Carousel';
import { CarouselProps, CarouselSlots } from '.';

const Carousel: FC<CarouselProps> = ({
  backgroundColor,
  spacing,
  border,
  fluidContent,
  height,
  itemsPerPage,
  gapX,
  component,
}) => (
  <BaseCarousel
    {...{ backgroundColor, spacing, border, fluidContent, height, itemsPerPage, gapX }}
    countOfItems={component?.slots?.[CarouselSlots.Items]?.length ?? 0}
    variant={component.variant}
  >
    {({ className, style }) => (
      <UniformSlot
        name={CarouselSlots.Items}
        emptyPlaceholder={<div className="mx-20 h-20 w-full" />}
        wrapperComponent={({ items }) => {
          return items.map((item, index) => (
            <div key={index} className={className} style={style}>
              {item}
            </div>
          ));
        }}
      />
    )}
  </BaseCarousel>
);

export default Carousel;

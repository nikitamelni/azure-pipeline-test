import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import BaseGrid from '@/components/ui/Grid';
import { GridProps, GridSlots } from '.';

const Grid: FC<GridProps> = ({
  columnsCount,
  gapX,
  gapY,
  backgroundColor,
  spacing,
  border,
  fluidContent,
  height,
  className,
  alignItems,
}) => (
  <BaseGrid
    className={className}
    {...{ columnsCount, gapX, gapY, backgroundColor, spacing, border, fluidContent, height, alignItems }}
  >
    <UniformSlot name={GridSlots.GridInner} />
  </BaseGrid>
);

export default Grid;

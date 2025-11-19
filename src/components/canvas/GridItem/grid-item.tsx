import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import BaseGridItem from '@/components/ui/GridItem';
import { GridItemProps, GridItemSlots } from '.';

const GridItem: FC<GridItemProps> = ({ columnStart, columnSpan, rowStart, rowSpan, alignSelf, className }) => (
  <BaseGridItem {...{ columnStart, columnSpan, rowStart, rowSpan, alignSelf, className }}>
    <UniformSlot name={GridItemSlots.Inner} />
  </BaseGridItem>
);

export default GridItem;

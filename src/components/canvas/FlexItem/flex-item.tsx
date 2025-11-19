import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import BaseFlexItem from '@/components/ui/FlexItem';
import { FlexItemProps, FlexItemSlots } from '.';

const FlexItem: FC<FlexItemProps> = ({ alignSelf, shrink }) => (
  <BaseFlexItem {...{ alignSelf, shrink }}>
    <UniformSlot name={FlexItemSlots.Inner} />
  </BaseFlexItem>
);

export default FlexItem;

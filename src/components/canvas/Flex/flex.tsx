import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import BaseFlex from '@/components/ui/Flex';
import { FlexProps, FlexSlots } from '.';

const Flex: FC<FlexProps> = ({
  direction,
  justifyContent,
  gap,
  alignItems,
  backgroundColor,
  spacing,
  border,
  fluidContent,
  className,
  height,
  wrapperClassName,
  wrap,
}) => (
  <BaseFlex
    {...{
      direction,
      justifyContent,
      gap,
      alignItems,
      backgroundColor,
      spacing,
      border,
      fluidContent,
      height,
      wrapperClassName,
      className,
      wrap,
    }}
  >
    <UniformSlot name={FlexSlots.FlexItem} />
  </BaseFlex>
);

export default Flex;

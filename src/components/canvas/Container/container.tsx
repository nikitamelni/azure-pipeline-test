import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import BaseContainer from '@/components/ui/Container';
import { ContainerProps, ContainerSlots } from '.';

const Container: FC<ContainerProps> = ({
  displayName,
  anchor: id,
  backgroundColor,
  spacing,
  border,
  fluidContent,
  height,
  className,
}) => (
  <BaseContainer
    {...{
      title: displayName,
      id,
      backgroundColor,
      spacing,
      border,
      fluidContent,
      height,
      className,
    }}
  >
    <UniformSlot name={ContainerSlots.ContainerContent} />
  </BaseContainer>
);

export default Container;

import { ComponentProps } from '@uniformdev/canvas-react';
import { ContainerParameters } from './parameters';

export type ContainerAdditionalProps = {
  className?: string;
};

export enum ContainerSlots {
  ContainerContent = 'containerContent',
}

export type ContainerProps = ComponentProps<ContainerParameters> & ContainerAdditionalProps;

export { type ContainerParameters } from './parameters';
export { default } from './container';

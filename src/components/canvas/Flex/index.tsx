import { ComponentProps } from '@uniformdev/canvas-react';
import { ContainerParameters } from '@/components/canvas/Container/parameters';
import { ViewPort } from '@/types/cskTypes';

type Direction = 'row' | 'row-reverse' | 'col' | 'col-reverse';
type Justify = 'start' | 'end' | 'center' | 'between';
type AvailableGap = '2' | '8' | '16';
type Align = 'start' | 'end' | 'center' | 'stretch';
type Wrap = 'nowrap' | 'wrap' | 'wrap-reverse';

export type FlexAdditionalProps = {
  className?: string;
  wrapperClassName?: string;
};

export type FlexParameters = ContainerParameters & {
  direction?: Direction | ViewPort<Direction>;
  justifyContent?: Justify | ViewPort<Justify>;
  gap?: AvailableGap | ViewPort<AvailableGap>;
  alignItems?: Align | ViewPort<Align>;
  wrap?: Wrap | ViewPort<Wrap>;
};

export enum FlexSlots {
  FlexItem = 'flexItem',
}

export type FlexProps = ComponentProps<FlexParameters> & FlexAdditionalProps;

export { default } from './flex';

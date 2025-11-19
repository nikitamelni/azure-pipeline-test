import { ComponentProps } from '@uniformdev/canvas-react';
import { ViewPort } from '@/types/cskTypes';

type AvailableAlignSelf = 'auto' | 'start' | 'end' | 'center' | 'stretch';
type AvailableShrink = '0' | '1';

export type FlexItemParameters = {
  displayName?: string;
  alignSelf?: AvailableAlignSelf | ViewPort<AvailableAlignSelf>;
  shrink?: AvailableShrink;
};

export enum FlexItemSlots {
  Inner = 'inner',
}

export type FlexItemProps = ComponentProps<FlexItemParameters>;

export { default } from './flex-item';

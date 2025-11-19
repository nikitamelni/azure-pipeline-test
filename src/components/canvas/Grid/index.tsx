import { ComponentProps } from '@uniformdev/canvas-react';
import { ContainerParameters } from '@/components/canvas/Container/parameters';
import { ViewPort } from '@/types/cskTypes';

type AvailableGridColumnsCount = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
type AvailableGridGap = '2' | '8' | '16';
type Align = 'start' | 'end' | 'center' | 'baseline' | 'stretch';

export type GridAdditionalProps = {
  className?: string;
};

export type GridParameters = ContainerParameters & {
  columnsCount?: AvailableGridColumnsCount | ViewPort<AvailableGridColumnsCount>;
  gapY?: AvailableGridGap | ViewPort<AvailableGridGap>;
  gapX?: AvailableGridGap | ViewPort<AvailableGridGap>;
  alignItems?: Align | ViewPort<Align>;
};

export enum GridSlots {
  GridInner = 'gridInner',
}

export type GridProps = ComponentProps<GridParameters> & GridAdditionalProps;

export { default } from './grid';

import { ComponentProps } from '@uniformdev/canvas-react';
import { ContainerParameters } from '@/components/canvas/Container/parameters';

export type TableParameters = ContainerParameters & {
  size?: string;
  textColor?: string;
};

export enum TableSlots {
  TableHead = 'tableHead',
  TableBody = 'tableBody',
}

export type TableProps = ComponentProps<TableParameters>;

export { default } from './table';

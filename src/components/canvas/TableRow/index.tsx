import { ComponentProps } from '@uniformdev/canvas-react';

export type TableRowParameters = unknown;

export enum TableRowSlots {
  TableRowCells = 'tableRowCells',
}

export type TableRowProps = ComponentProps<TableRowParameters>;

export { default } from './table-row';

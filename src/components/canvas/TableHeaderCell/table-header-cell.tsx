import { FC } from 'react';
import { UniformText } from '@uniformdev/canvas-react';
import { TableHeaderCellProps } from '.';

const TableHeaderCell: FC<TableHeaderCellProps> = () => (
  <th>
    <UniformText parameterId="value" placeholder="Value" />
  </th>
);

export default TableHeaderCell;

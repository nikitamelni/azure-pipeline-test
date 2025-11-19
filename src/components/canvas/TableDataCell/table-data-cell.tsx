import { FC } from 'react';
import { UniformText } from '@uniformdev/canvas-react';
import { TableDataCellProps } from '.';

const TableDataCell: FC<TableDataCellProps> = () => (
  <td>
    <UniformText parameterId="value" placeholder="Value" />
  </td>
);

export default TableDataCell;

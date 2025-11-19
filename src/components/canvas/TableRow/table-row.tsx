import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import { TableRowProps, TableRowSlots } from '.';

const TableRow: FC<TableRowProps> = () => (
  <tr>
    <UniformSlot name={TableRowSlots.TableRowCells} />
  </tr>
);

export default TableRow;

import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import { cn } from '@/utils/styling';
import { AlignmentMap, TableCustomCellProps, TableCustomCellSlots } from '.';

const TableCustomCell: FC<TableCustomCellProps> = ({ alignment }) => (
  <td>
    <div className={cn('w-fit', AlignmentMap[alignment || 'left'])}>
      <UniformSlot name={TableCustomCellSlots.TableCustomCellContent} />
    </div>
  </td>
);

export default TableCustomCell;

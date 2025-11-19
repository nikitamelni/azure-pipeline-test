import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import Container from '@/components/ui/Container';
import { TableProps, TableSlots } from '.';
import { getTableClasses } from './style-utils';

const Table: FC<TableProps> = ({ size, textColor, backgroundColor, spacing, border, fluidContent, height }) => (
  <Container className="flex flex-col gap-5" {...{ backgroundColor, spacing, border, fluidContent, height }}>
    <div className="overflow-x-auto">
      <table className={getTableClasses({ size, textColor })}>
        <thead>
          <UniformSlot name={TableSlots.TableHead} emptyPlaceholder={<tr className="h-20" />} />
        </thead>
        <tbody>
          <UniformSlot name={TableSlots.TableBody} emptyPlaceholder={<tr className="h-40" />} />
        </tbody>
      </table>
    </div>
  </Container>
);

export default Table;

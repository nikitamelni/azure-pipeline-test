import { FC } from 'react';
import { cn } from '@/utils/styling';
import { DividerProps } from '.';

const Divider: FC<DividerProps> = ({ color, thickness, width, alignment }) => (
  <div className={cn('flex w-full', `justify-${alignment || 'center'}`)}>
    <div className={cn({ [`bg-${color}`]: !!color })} style={{ width, height: thickness }} />
  </div>
);

export default Divider;

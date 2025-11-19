import { FC, SVGProps } from 'react';
import { cn } from '@/utils/styling';

export const Dot: FC<SVGProps<SVGSVGElement>> = ({ className, ...restProps }) => (
  <svg viewBox="0 0 6 6" aria-hidden="true" className={cn('w-1.5 h-1.5', className)} {...restProps}>
    <circle r="3" cx="3" cy="3" />
  </svg>
);

import { cn } from '@/utils/styling';
import { NavigationGroupParameters } from '.';

type CaretClassesProps = {
  isOpen?: boolean;
};
export const getCaretClasses = ({ isOpen }: CaretClassesProps) =>
  cn('transition transform hidden md:block', {
    'rotate-180': isOpen,
    'rotate-0': !isOpen,
  });

type ButtonClassesProps = {
  color?: NavigationGroupParameters['color'];
};
export const getButtonClasses = ({ color }: ButtonClassesProps) =>
  cn('flex items-center gap-x-2', {
    [`text-${color}`]: !!color,
  });

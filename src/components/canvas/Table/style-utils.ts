import { cn } from '@/utils/styling';
import { TableParameters } from '.';

type TableClassesProps = {
  size?: TableParameters['size'];
  textColor?: TableParameters['textColor'];
};
export const getTableClasses = ({ size, textColor }: TableClassesProps) =>
  cn('text-left w-full [&_tr:not(:last-child)_td]:border-b [&_th]:border-b', {
    [`text-${textColor}`]: textColor,
    [`[&_td]:p-${size} [&_th]:p-${size}`]: size,
  });

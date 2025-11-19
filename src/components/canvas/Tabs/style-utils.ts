import { cn } from '@/utils/styling';
import { TabsParameters } from '.';

export enum TabsVariants {
  Bordered = 'bordered',
}

type ButtonContainerClassesProps = {
  color: TabsParameters['color'];
  variant?: string;
};
export const getButtonContainerClasses = ({ color, variant }: ButtonContainerClassesProps) =>
  cn('flex flex-row overflow-x-auto ', {
    [`border-${color} border-b`]: color && variant === TabsVariants.Bordered,
  });

type ButtonClassesProps = {
  color: TabsParameters['color'];
  variant?: string;
  isActiveTab?: boolean;
};
export const getButtonClasses = ({ color, variant, isActiveTab = false }: ButtonClassesProps) =>
  cn('text-lg shrink-0 font-medium px-5 py-3', {
    [`text-${color}`]: color,
    [`border-${color}`]: isActiveTab && variant === TabsVariants.Bordered,
    'border-b-2': variant === TabsVariants.Bordered,
    'opacity-60 hover:opacity-100': !isActiveTab,
    'border-transparent': !isActiveTab && variant === TabsVariants.Bordered,
  });

import { ComponentProps } from '@uniformdev/canvas-react';
import { ContainerParameters } from '@/components/canvas/Container/parameters';

export type TabsParameters = ContainerParameters & {
  color?: string;
};

export enum TabsSlots {
  TabItems = 'tabItems',
}

export type TabsProps = ComponentProps<TabsParameters>;

export { TabsVariants } from './style-utils';
export { default } from './tabs';

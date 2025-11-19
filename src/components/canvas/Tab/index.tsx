import { ComponentProps } from '@uniformdev/canvas-react';

export type TabParameters = { title?: string };

export enum TabSlots {
  TabContent = 'tabContent',
}

export type TabProps = ComponentProps<TabParameters>;

export { default } from './tab';

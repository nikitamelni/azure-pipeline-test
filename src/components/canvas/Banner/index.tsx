import { ComponentProps } from '@uniformdev/canvas-react';
import { ContainerParameters } from '@/components/canvas/Container/parameters';

export enum ContentAlignment {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}

export type BannerParameters = ContainerParameters & {
  iconColor?: string;
  contentAlignment?: ContentAlignment;
  floating?: boolean;
};
export enum BannerSlots {
  BannerContent = 'bannerContent',
}

export type BannerProps = ComponentProps<BannerParameters>;

export { default } from './banner';

import { ComponentProps } from '@uniformdev/canvas-react';
import { ContainerParameters } from '@/components/canvas/Container/parameters';

export type CarouselParameters = ContainerParameters & {
  itemsPerPage?: string;
  gapX?: string;
};

export enum CarouselSlots {
  Items = 'carouselItems',
}

export type CarouselProps = ComponentProps<CarouselParameters>;

export { default } from './carousel';

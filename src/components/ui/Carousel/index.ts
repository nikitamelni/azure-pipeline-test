import { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import { ContainerProps as BaseContainerProps } from '@/components/ui/Container';

export type CarouselProps = Pick<
  BaseContainerProps,
  'title' | 'backgroundColor' | 'spacing' | 'border' | 'fluidContent' | 'height'
> & {
  countOfItems?: number;
  children: (options: { className?: string; style?: React.CSSProperties }) => ReactElement;
  itemsPerPage?: string;
  gapX?: string;
  variant?: string;
};

export enum CarouselVariant {
  DEFAULT = 'default',
  BROCHURE = 'brochure',
  NUMERIC = 'numeric',
}

export default dynamic(() => import('./carousel').then(mod => mod.Carousel));

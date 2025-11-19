import { DataWithProperties } from '@uniformdev/canvas';
import { ComponentProps } from '@uniformdev/canvas-react';
import { TextParameters } from '@/components/canvas/Text/parameters';

export type BreadcrumbLink = {
  title: string;
  link?: string;
};

export type BreadcrumbsParameters = {
  title?: string;
  separator?: 'slash' | 'chevron';
  links?: DataWithProperties[];
  autoGenerate?: boolean;
} & Pick<TextParameters, 'size' | 'color' | 'font' | 'transform'>;

export type BreadcrumbsProps = ComponentProps<BreadcrumbsParameters>;
export { default as BreadcrumbsContextProvider, useBreadcrumbsContext } from './breadcrumbsContext';
export { default } from './breadcrumbs';

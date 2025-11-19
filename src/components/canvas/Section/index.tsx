import { ComponentProps } from '@uniformdev/canvas-react';
import { ContainerParameters } from '@/components/canvas/Container/parameters';

export enum ContentAlignment {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}

export type SectionParameters = ContainerParameters & {
  contentAlignment?: ContentAlignment;
};

export enum SectionVariants {
  Columns = 'columns',
  ColumnsReverse = 'columnsReverse',
}

export enum SectionSlots {
  SectionContent = 'sectionContent',
  SectionMedia = 'sectionMedia',
  SectionCTA = 'sectionCTA',
}

export type SectionProps = ComponentProps<SectionParameters>;

export { default } from './section';

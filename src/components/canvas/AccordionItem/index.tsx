import { ComponentProps } from '@uniformdev/canvas-react';
import { ContainerParameters } from '@/components/canvas/Container/parameters';
import { TextParameters } from '@/components/canvas/Text/parameters';

export type AccordionItemParameters = Pick<ContainerParameters, 'backgroundColor' | 'spacing' | 'border'> &
  TextParameters;

export type AccordionItemAdditionalProps = {
  className?: string;
};

export enum AccordionItemSlots {
  AccordionItemContent = 'accordionItemContent',
}

export type AccordionItemProps = ComponentProps<AccordionItemParameters> & AccordionItemAdditionalProps;

export { default } from './accordion-item';

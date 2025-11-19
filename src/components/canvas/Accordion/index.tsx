import { ComponentProps } from '@uniformdev/canvas-react';
import { ContainerParameters } from '@/components/canvas/Container/parameters';

export type AccordionParameters = ContainerParameters;

export enum AccordionSlots {
  AccordionContent = 'accordionContent',
  AccordionItems = 'accordionItems',
}

export type AccordionProps = ComponentProps<AccordionParameters>;

export { Accordion as default } from './accordion';

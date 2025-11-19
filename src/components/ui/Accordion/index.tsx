import { ReactNode } from 'react';
import { ContainerProps } from '@/components/ui/Container';

export type AccordionProps = ContainerProps & {
  accordionContent?: ReactNode;
  accordionItems: ReactNode;
};

export { Accordion as default } from './accordion';

import { ReactElement, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { ContainerProps } from '@/components/ui/Container';

export type AccordionItemParameters = Pick<ContainerProps, 'backgroundColor' | 'spacing' | 'border'> & {
  text: ReactElement;
  accordionItemContent: ReactNode;
};

export type AccordionItemAdditionalProps = {
  className?: string;
};

export type AccordionItemProps = AccordionItemParameters & AccordionItemAdditionalProps;

export default dynamic(() => import('./accordion-item').then(mod => mod.AccordionItem));

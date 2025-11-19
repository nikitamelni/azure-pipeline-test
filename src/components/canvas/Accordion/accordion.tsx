import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import BaseAccordion from '@/components/ui/Accordion';
import { AccordionProps, AccordionSlots } from '.';

export const Accordion: FC<AccordionProps> = ({ backgroundColor, spacing, border, fluidContent, height }) => (
  <BaseAccordion
    accordionContent={
      <UniformSlot name={AccordionSlots.AccordionContent} emptyPlaceholder={<div className="h-20" />} />
    }
    accordionItems={<UniformSlot name={AccordionSlots.AccordionItems} emptyPlaceholder={<div className="h-28" />} />}
    {...{ backgroundColor, spacing, border, fluidContent, height }}
  />
);

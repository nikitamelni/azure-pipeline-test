import { FC } from 'react';
import Container from '@/components/ui/Container';
import { cn } from '@/utils/styling';
import { AccordionProps } from '.';

export const Accordion: FC<AccordionProps> = ({
  accordionContent,
  accordionItems,
  backgroundColor,
  spacing,
  border,
  fluidContent,
  height,
  className,
}) => (
  <Container
    className={cn('flex flex-col gap-8', className)}
    {...{ backgroundColor, spacing, border, fluidContent, height }}
  >
    {accordionContent && <div className="flex flex-col gap-4 text-start">{accordionContent}</div>}
    {accordionItems}
  </Container>
);

import { FC } from 'react';
import { UniformSlot, UniformText } from '@uniformdev/canvas-react';
import BaseAccordionItem from '@/components/ui/AccordionItem';
import BaseText from '@/components/ui/Text';
import { AccordionItemProps, AccordionItemSlots } from '.';

const AccordionItem: FC<AccordionItemProps> = ({
  tag,
  alignment,
  color,
  size,
  font,
  weight,
  transform,
  decoration,
  letterSpacing,
  backgroundColor,
  spacing,
  className,
}) => (
  <BaseAccordionItem
    {...{
      backgroundColor,
      spacing,
      className,
    }}
    text={
      <BaseText {...{ alignment, color, size, font, weight, transform, decoration, letterSpacing }}>
        <UniformText placeholder="Text goes here" parameterId="text" as={tag || undefined} />
      </BaseText>
    }
    accordionItemContent={<UniformSlot name={AccordionItemSlots.AccordionItemContent} />}
  />
);

export default AccordionItem;

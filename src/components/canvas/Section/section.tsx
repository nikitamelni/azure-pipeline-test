import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import { SectionProps, SectionSlots, SectionVariants } from '.';
import { ColumnsVariant } from './columns-variant';
import { DefaultVariant } from './default-variant';
import { getButtonAlignmentClass, getTextAlignmentClass } from './style-utils';

const Section: FC<SectionProps> = ({
  contentAlignment,
  backgroundColor,
  spacing,
  border,
  fluidContent,
  height,
  component,
}) => {
  const variant = component.variant as SectionVariants;

  const variantProps = {
    backgroundColor,
    spacing,
    border,
    fluidContent,
    height,
    textAlignmentClass: getTextAlignmentClass({ contentAlignment }),
    buttonAlignmentClass: getButtonAlignmentClass({ contentAlignment }),
    sectionMedia: (
      <UniformSlot name={SectionSlots.SectionMedia} emptyPlaceholder={variant ? null : <div className="size-full" />} />
    ),
    sectionContent: component.slots?.sectionContent ? (
      <UniformSlot name={SectionSlots.SectionContent} emptyPlaceholder={<div className="h-20" />} />
    ) : undefined,
    sectionCTA: component.slots?.sectionCTA ? (
      <UniformSlot name={SectionSlots.SectionCTA} emptyPlaceholder={<div className="mx-40 h-20 w-full" />} />
    ) : undefined,
  };

  switch (variant) {
    case SectionVariants.Columns:
    case SectionVariants.ColumnsReverse:
      return <ColumnsVariant variant={variant} {...variantProps} />;
    default:
      return <DefaultVariant {...variantProps} />;
  }
};

export default Section;

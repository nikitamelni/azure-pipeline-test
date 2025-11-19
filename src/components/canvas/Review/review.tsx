import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import { ReviewProps, ReviewSlots, ReviewVariants } from '.';
import { DefaultVariant } from './default-variant';
import { MultiColumnVariant } from './multi-column-variant';

const Review: FC<ReviewProps> = props => {
  const { component } = props;
  const variant = component.variant as ReviewVariants | undefined;
  const isMultiColumn = variant === ReviewVariants.MultiColumn;

  const variantProps = {
    ...props,
    ReviewImage: (
      <UniformSlot
        name={ReviewSlots.ReviewImage}
        emptyPlaceholder={isMultiColumn ? <div className="size-full" /> : null}
      />
    ),
    ReviewPersonInfo: (
      <UniformSlot
        name={ReviewSlots.ReviewPersonInfo}
        emptyPlaceholder={isMultiColumn ? <div className="h-20 w-full" /> : <div className="h-20 w-52" />}
      />
    ),
    ReviewContent: (
      <UniformSlot
        name={ReviewSlots.ReviewContent}
        emptyPlaceholder={isMultiColumn ? <div className="h-20 w-full" /> : <div className="h-20 w-52" />}
      />
    ),
  };

  switch (variant) {
    case ReviewVariants.MultiColumn:
      return <MultiColumnVariant {...variantProps} />;
    default:
      return <DefaultVariant {...variantProps} />;
  }
};

export default Review;

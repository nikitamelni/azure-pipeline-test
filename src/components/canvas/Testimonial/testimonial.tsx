import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import { TestimonialVariants, TestimonialProps, TestimonialSlots } from '.';
import { DefaultVariant } from './default-variant';
import { WithLargeAvatarVariant } from './with-large-avatar-variant';
import { WithOverlappingImageVariant } from './with-overlapping-image-variant';

const Testimonial: FC<TestimonialProps> = ({ backgroundColor, spacing, border, fluidContent, height, component }) => {
  const variant = component.variant as TestimonialVariants | undefined;

  const variantProps = {
    backgroundColor,
    spacing,
    border,
    fluidContent,
    height,
    testimonialPrimaryImage: (
      <UniformSlot name={TestimonialSlots.TestimonialPrimaryImage} emptyPlaceholder={<div className="size-full" />} />
    ),
    testimonialContent: (
      <UniformSlot name={TestimonialSlots.TestimonialContent} emptyPlaceholder={<div className="h-20 w-64" />} />
    ),
    testimonialAuthor: (
      <UniformSlot name={TestimonialSlots.TestimonialAuthor} emptyPlaceholder={<div className="h-20 w-64" />} />
    ),
    testimonialSecondaryImage: (
      <UniformSlot name={TestimonialSlots.TestimonialSecondaryImage} emptyPlaceholder={<div className="h-20 w-64" />} />
    ),
  };

  switch (variant) {
    case TestimonialVariants.WithLargeAvatar:
      return <WithLargeAvatarVariant {...variantProps} />;

    case TestimonialVariants.WithOverlappingImage:
      return <WithOverlappingImageVariant {...variantProps} />;

    default:
      return <DefaultVariant {...variantProps} />;
  }
};

export default Testimonial;

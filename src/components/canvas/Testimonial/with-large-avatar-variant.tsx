import { FC } from 'react';
import Container from '@/components/ui/Container';
import { TestimonialParameters } from '.';

type WithLargeAvatarVariantProps = Pick<
  TestimonialParameters,
  'backgroundColor' | 'spacing' | 'border' | 'fluidContent' | 'height'
> & {
  testimonialPrimaryImage: React.ReactNode;
  testimonialContent: React.ReactNode;
  testimonialAuthor: React.ReactNode;
  testimonialSecondaryImage: React.ReactNode;
};

export const WithLargeAvatarVariant: FC<WithLargeAvatarVariantProps> = ({
  testimonialPrimaryImage,
  testimonialContent,
  testimonialAuthor,
  testimonialSecondaryImage,
  backgroundColor,
  spacing,
  border,
  fluidContent,
  height,
}) => (
  <Container {...{ backgroundColor, spacing, border, fluidContent, height }}>
    <div className="mx-auto flex items-center gap-x-10 md:max-w-[80%]">
      <div className="hidden aspect-square w-full max-w-xs shrink-0 overflow-hidden rounded-xl lg:block">
        {testimonialPrimaryImage}
      </div>
      <div className="flex flex-col gap-y-8">
        <div className="">{testimonialContent}</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-4">
            <div className="block aspect-square w-10 overflow-hidden rounded-md lg:hidden">
              {testimonialPrimaryImage}
            </div>
            <div className="gap-3">{testimonialAuthor}</div>
          </div>
          {testimonialSecondaryImage}
        </div>
      </div>
    </div>
  </Container>
);

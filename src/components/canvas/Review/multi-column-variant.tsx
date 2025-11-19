import { FC, ReactNode } from 'react';
import Container from '@/components/ui/Container';
import Rating from '@/components/ui/Rating';
import { ReviewProps } from '.';

type MultiColumnVariantProps = ReviewProps & {
  ReviewImage: ReactNode;
  ReviewPersonInfo: ReactNode;
  ReviewContent: ReactNode;
};

export const MultiColumnVariant: FC<MultiColumnVariantProps> = ({
  stars,
  starsColor,
  activeStarsColor,
  showRatingLabel,
  backgroundColor,
  spacing,
  border,
  fluidContent,
  height,
  ReviewImage,
  ReviewPersonInfo,
  ReviewContent,
}) => (
  <Container {...{ backgroundColor, spacing, border, fluidContent, height }}>
    <div className="grid md:grid-cols-12">
      <div className="mb-2 md:col-span-4 md:my-0">
        <div className="mb-2 aspect-square size-12 rounded-full">{ReviewImage}</div>
        <div className="flex flex-col gap-y-1">{ReviewPersonInfo}</div>
      </div>
      <div className="my-2 md:col-span-4 md:my-0">
        <Rating
          rating={stars}
          showReviewLabel={showRatingLabel}
          starsColor={starsColor}
          activeStarsColor={activeStarsColor}
        />
      </div>
      <div className="mt-2 flex flex-col gap-y-3 md:col-span-4 md:my-0">{ReviewContent}</div>
    </div>
  </Container>
);

import { FC, ReactNode } from 'react';
import Container from '@/components/ui/Container';
import Rating from '@/components/ui/Rating';
import { ReviewProps } from '.';

type DefaultVariantProps = ReviewProps & {
  ReviewImage: ReactNode;
  ReviewPersonInfo: ReactNode;
  ReviewContent: ReactNode;
};

export const DefaultVariant: FC<DefaultVariantProps> = ({
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
    <div className="mx-auto flex lg:max-w-[60%]">
      <div className="aspect-square size-12 shrink-0 rounded-full">{ReviewImage}</div>
      <div className="ml-6">
        {ReviewPersonInfo}
        <div className="py-4">
          <Rating
            rating={stars}
            showReviewLabel={showRatingLabel}
            starsColor={starsColor}
            activeStarsColor={activeStarsColor}
          />
        </div>
        <div className="flex flex-col gap-y-5">{ReviewContent}</div>
      </div>
    </div>
  </Container>
);

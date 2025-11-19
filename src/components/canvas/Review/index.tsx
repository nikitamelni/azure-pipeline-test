import { ComponentProps } from '@uniformdev/canvas-react';
import { ContainerParameters } from '@/components/canvas/Container/parameters';

export type ReviewParameters = ContainerParameters & {
  stars?: number;
  starsColor?: string;
  activeStarsColor?: string;
  showRatingLabel?: boolean;
};

export enum ReviewVariants {
  MultiColumn = 'multiColumn',
}

export enum ReviewSlots {
  ReviewImage = 'reviewImage',
  ReviewPersonInfo = 'reviewPersonInfo',
  ReviewContent = 'reviewContent',
}

export type ReviewProps = ComponentProps<ReviewParameters>;

export { default } from './review';

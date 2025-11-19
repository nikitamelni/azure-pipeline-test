import { cn } from '@/utils/styling';
import { ContentAlignment } from '.';
import { BannerVariants, ContentClassesProps, PositionClassesProps } from './types';

export const getPositionClasses = ({ variant, floating }: PositionClassesProps) =>
  cn({
    '!w-11/12 left-1/2 -translate-x-1/2 my-4': floating && !!variant,
    'fixed top-0 w-full z-10': variant === BannerVariants.Top,
    'fixed bottom-0 w-full z-10': variant === BannerVariants.Bottom,
    'p-4': floating && !variant,
  });

export const getContentClasses = ({ contentAlignment, iconColor, fluidContent, floating }: ContentClassesProps) =>
  cn('flex flex-row gap-x-4', {
    'justify-start': contentAlignment === ContentAlignment.Left,
    'justify-center': contentAlignment === ContentAlignment.Center,
    'justify-end': contentAlignment === ContentAlignment.Right,
    'pr-10': contentAlignment === ContentAlignment.Right && iconColor,
    '!mx-0': !fluidContent,
    'rounded-lg': floating,
  });

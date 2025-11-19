import { cn } from '@/utils/styling';
import { ContentAlignment, FlexibleHeroParameters } from '.';

type AlignmentClass = {
  contentAlignment: FlexibleHeroParameters['contentAlignment'];
};

export const getButtonAlignmentClass = ({ contentAlignment }: AlignmentClass) =>
  cn('justify-center', {
    '!justify-start': contentAlignment === ContentAlignment.Left,
    '!justify-end': contentAlignment === ContentAlignment.Right,
  });

export const getTextAlignmentClass = ({ contentAlignment }: AlignmentClass) =>
  cn('text-center', {
    'text-start': contentAlignment === ContentAlignment.Left,
    'text-end': contentAlignment === ContentAlignment.Right,
  });

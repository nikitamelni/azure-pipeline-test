import { cn } from '@/utils/styling';
import { BadgeParameters } from '.';

type BadgeClass = {
  pill: BadgeParameters['pill'];
  size: BadgeParameters['size'];
  dotColor: BadgeParameters['dotColor'];
  borderColor: BadgeParameters['borderColor'];
  backgroundColor: BadgeParameters['backgroundColor'];
};
export const getBadgeClass = ({ pill, size, dotColor, borderColor, backgroundColor }: BadgeClass) =>
  cn('inline-flex items-center w-fit', {
    'rounded-full': pill,
    'rounded-md': !pill,
    'gap-x-1.5': !!dotColor,
    [`ring-1 ring-inset ring-${borderColor}`]: !!borderColor,
    [`bg-${backgroundColor}`]: !!backgroundColor,
    [`p-${size}`]: size,
  });

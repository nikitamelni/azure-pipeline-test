import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import { cn, resolveViewPort } from '@/utils/styling';
import { NavigationGroupParameters, NavigationGroupSlots } from '.';

type NavigationGroupDesktopContentProps = Pick<NavigationGroupParameters, 'backgroundColor' | 'border'> & {
  isOpen: boolean;
};

export const NavigationGroupDesktopContent: FC<NavigationGroupDesktopContentProps> = ({
  isOpen,
  backgroundColor,
  border,
}) => (
  <div
    className={cn('absolute left-0 max-w-64 z-10 pt-4', {
      hidden: !isOpen,
      block: isOpen,
    })}
  >
    <div
      className={cn({
        [`bg-${backgroundColor}`]: !!backgroundColor,
        [resolveViewPort(border, '{value}')]: border,
      })}
    >
      <div className="flex flex-col gap-y-4 p-4">
        <UniformSlot name={NavigationGroupSlots.Links} emptyPlaceholder={<div className="h-40 w-48" />} />
      </div>
    </div>
  </div>
);

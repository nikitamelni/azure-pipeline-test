import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import Grid from '@/components/ui/Grid';
import GridItem from '@/components/ui/GridItem';
import { cn, resolveViewPort } from '@/utils/styling';
import { NavigationFlyoutParameters, NavigationFlyoutSlots } from '.';

type NavigationFlyoutPropsDesktopContentProps = Pick<NavigationFlyoutParameters, 'backgroundColor' | 'border'> & {
  isOpen: boolean;
  hasRightContent: boolean;
};

export const NavigationFlyoutPropsDesktopContent: FC<NavigationFlyoutPropsDesktopContentProps> = ({
  isOpen,
  backgroundColor,
  border,
  hasRightContent,
}) => (
  <div
    className={cn('absolute z-10 w-max left-1/2 -translate-x-1/2 pt-4', {
      hidden: !isOpen,
      block: isOpen,
      'w-full md:w-[460px]': !hasRightContent,
      'w-full md:w-[460px] xl:w-[768px]': hasRightContent,
    })}
  >
    <div
      className={cn('p-8', {
        [`bg-${backgroundColor}`]: !!backgroundColor,
        [resolveViewPort(border, '{value}')]: border,
      })}
    >
      <Grid columnsCount="2" gapX="4">
        <GridItem>
          <div className="flex flex-col gap-y-4">
            <UniformSlot
              name={NavigationFlyoutSlots.NavigationFlyoutLeftContent}
              emptyPlaceholder={<div className="h-40 w-48" />}
            />
          </div>
        </GridItem>
        <GridItem>
          <UniformSlot
            name={NavigationFlyoutSlots.NavigationFlyoutRightContent}
            emptyPlaceholder={<div className="h-40 w-48" />}
          />
        </GridItem>
      </Grid>
    </div>
  </div>
);

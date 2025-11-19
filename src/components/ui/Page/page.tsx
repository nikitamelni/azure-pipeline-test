import { FC } from 'react';
import { cn } from '@/utils/styling';
import { PageProps } from '.';

export const Page: FC<PageProps> = ({ className, header, footer, children, backgroundColor, ...restProps }) => (
  <div
    className={cn('flex min-h-screen flex-col', className, {
      [`bg-${backgroundColor}`]: !!backgroundColor,
    })}
    {...restProps}
  >
    {header}

    <div className="flex flex-1 flex-col">{children}</div>

    {footer}
  </div>
);

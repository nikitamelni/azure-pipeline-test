import { FC } from 'react';
import BaseText from '@/components/ui/Text';
import { cn } from '@/utils/styling';
import { IconLabelProps } from '.';

export const IconLabel: FC<IconLabelProps> = ({
  icon,
  size,
  tag,
  color,
  weight,
  font,
  transform,
  decoration,
  letterSpacing,
  alignment,
  children,
  textClassName,
  iconClassName,
  className,
  iconPosition,
}) => (
  <div
    className={cn(
      'flex w-fit items-center gap-x-3',
      {
        [`text-${size}`]: !!size,
        [`text-${color}`]: !!color,
        'flex-row-reverse': icon && iconPosition === 'right',
      },
      className
    )}
  >
    {icon && <div className={cn('relative size-[1em]', iconClassName)}>{icon}</div>}
    <BaseText
      {...{
        alignment,
        tag,
        color,
        size,
        font,
        weight,
        transform,
        decoration,
        letterSpacing,
        className: textClassName,
      }}
    >
      {children}
    </BaseText>
  </div>
);

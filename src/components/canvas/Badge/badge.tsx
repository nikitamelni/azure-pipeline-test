import { FC } from 'react';
import { UniformText } from '@uniformdev/canvas-react';
import BaseText from '@/components/ui/Text';
import { cn } from '@/utils/styling';
import { BadgeProps } from '.';
import { Dot } from './dot';
import { getBadgeClass } from './style-utils';

const Badge: FC<BadgeProps> = ({ textColor, backgroundColor, borderColor, dotColor, pill = false, size }) => (
  <div className={getBadgeClass({ pill, size, dotColor, borderColor, backgroundColor })}>
    {dotColor && (
      <Dot
        className={cn({
          [`fill-${dotColor}`]: dotColor,
        })}
      />
    )}
    <BaseText color={textColor} size="xs">
      <UniformText placeholder="Badge text goes here" parameterId="text" />
    </BaseText>
  </div>
);

export default Badge;

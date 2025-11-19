import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import BaseHeader from '@/components/ui/Header';
import { HeaderProps, HeaderSlots, HeaderVariants } from '.';

const Header: FC<HeaderProps> = ({ backgroundColor, color, spacing, border, component }) => (
  <BaseHeader
    sticky={component.variant === HeaderVariants.Sticky}
    leftSection={<UniformSlot name={HeaderSlots.HeaderLeftContent} emptyPlaceholder={<div className="h-20 w-48" />} />}
    rightSection={
      <UniformSlot name={HeaderSlots.HeaderRightContent} emptyPlaceholder={<div className="h-20 w-48" />} />
    }
    {...{ backgroundColor, color, spacing, border }}
  >
    <UniformSlot name={HeaderSlots.HeaderCenterContent} emptyPlaceholder={<div className="h-20 w-full" />} />
  </BaseHeader>
);

export default Header;

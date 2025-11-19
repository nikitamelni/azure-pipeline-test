import { ComponentProps } from '@uniformdev/canvas-react';
import { HeaderProps as BaseHeaderProps } from '@/components/ui/Header';

export type HeaderParameters = Omit<BaseHeaderProps, 'sticky'>;

export enum HeaderSlots {
  HeaderLeftContent = 'headerLeftContent',
  HeaderCenterContent = 'headerCenterContent',
  HeaderRightContent = 'headerRightContent',
}

export enum HeaderVariants {
  Sticky = 'sticky',
}

export type HeaderProps = ComponentProps<HeaderParameters>;

export { default } from './header';

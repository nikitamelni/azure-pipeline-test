import { ComponentProps } from '@uniformdev/canvas-react';
import { FooterProps as BaseFooterProps } from '@/components/ui/Footer';

export type FooterParameters = BaseFooterProps;

export enum FooterSlots {
  FooterLogo = 'footerLogo',
  FooterCopyright = 'footerCopyright',
  FooterContent = 'footerContent',
}

export type FooterProps = ComponentProps<FooterParameters>;

export { default } from './footer';

import { AssetParamValue, DataWithProperties, LinkParamValue, RichTextParamValue } from '@uniformdev/canvas';
import { ComponentProps } from '@uniformdev/canvas-react';

export type SimpleFooterParameters = {
  logo?: AssetParamValue;
  copyright?: RichTextParamValue;
  footerLinkSectionTitle?: string;
  links?: DataWithProperties;
};

export type FooterLink = {
  title: string;
  link: LinkParamValue;
};

export type SimpleFooterProps = ComponentProps<SimpleFooterParameters>;

export { default } from './simple-footer';

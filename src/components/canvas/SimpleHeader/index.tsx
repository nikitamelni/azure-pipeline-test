import { AssetParamValue, DataWithProperties, LinkParamValue } from '@uniformdev/canvas';
import { ComponentProps } from '@uniformdev/canvas-react';

export type SimpleHeaderParameters = {
  logo?: AssetParamValue;
  color?: string;
  links?: DataWithProperties;
  backgroundColor?: string;
  textColor?: string;
  hoverTextColor?: string;
};

export enum SimpleHeaderVariants {
  Sticky = 'sticky',
}

export type HeaderLink = {
  title: string;
  link: LinkParamValue;
};

export type SimpleHeaderProps = ComponentProps<SimpleHeaderParameters>;

export { default } from './simple-header';

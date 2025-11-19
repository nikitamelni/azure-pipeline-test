import { LinkParamValue } from '@uniformdev/canvas';
import { ComponentProps } from '@uniformdev/canvas-react';

export type LinkParameters = {
  displayName?: string;
  link?: LinkParamValue;
  openInNewTab?: boolean;
};

export enum LinkSlots {
  LinkContent = 'linkContent',
}

export type LinkProps = ComponentProps<LinkParameters>;

export { default } from './link';

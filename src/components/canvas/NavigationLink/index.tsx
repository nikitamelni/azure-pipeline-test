import { AssetParamValue } from '@uniformdev/assets';
import { LinkParamValue } from '@uniformdev/canvas';
import { ComponentProps } from '@uniformdev/canvas-react';
import { TextParameters } from '@/components/canvas/Text/parameters';
import { ViewPort } from '@/types/cskTypes';

export type NavigationLinkParameters = TextParameters & {
  icon?: AssetParamValue;
  link?: LinkParamValue;
  activeState?: boolean;
  hoverEffect?: string | ViewPort<string>;
  className?: string;
};

export type NavigationLinkProps = ComponentProps<NavigationLinkParameters>;

export { default } from './navigation-link';

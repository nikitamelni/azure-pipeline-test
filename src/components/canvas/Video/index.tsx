import { AssetParamValue } from '@uniformdev/assets';
import { ComponentProps } from '@uniformdev/canvas-react';
import { ViewPort } from '@/types/cskTypes';

export type VideoParameters = {
  video?: AssetParamValue;
  placeholderImage?: AssetParamValue;
  autoPlay?: boolean;
  lazyLoad?: boolean;
  loop?: boolean;
  controls?: boolean;
  muted?: boolean;
  overlayColor?: string;
  overlayOpacity?: string;
  border?: string | ViewPort<string>;
};

export type VideoProps = ComponentProps<VideoParameters>;

export { default } from './video';

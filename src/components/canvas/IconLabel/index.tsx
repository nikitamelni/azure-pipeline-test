import { AssetParamValue } from '@uniformdev/assets';
import { ComponentProps } from '@uniformdev/canvas-react';
import { IconLabelProps as BaseIconLabelParameters } from '@/components/ui/IconLabel';

export type IconLabelParameters = Omit<BaseIconLabelParameters, 'children'> & {
  icon?: AssetParamValue;
};

export type IconLabelProps = ComponentProps<IconLabelParameters>;

export { default } from './icon-label';

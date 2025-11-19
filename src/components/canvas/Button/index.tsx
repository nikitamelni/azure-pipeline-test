import { AssetParamValue } from '@uniformdev/assets';
import { LinkParamValue } from '@uniformdev/canvas';
import { ComponentProps } from '@uniformdev/canvas-react';
import { ButtonProps as BaseButtonProps } from '@/components/ui/Button';
import { ViewPort } from '@/types/cskTypes';

export type ButtonParameters = {
  text?: string;
  link?: LinkParamValue;
  textColor?: string;
  textWeight?: string;
  textFont?: 'uppercase' | 'lowercase' | 'capitalize' | 'normal-case';
  textTransform?: string;
  buttonColor?: string;
  border?: string | ViewPort<string>;
  size?: string;
  icon?: AssetParamValue;
  test?: AssetParamValue;
  textSize?: BaseButtonProps['textSize'];
  iconPosition?: BaseButtonProps['iconPosition'];
  hoverButtonColor?: string;
  hoverTextColor?: string;
};

export type ButtonAdditionalProps = {
  className?: string;
  onClick?: () => void;
};

export type ButtonProps = ComponentProps<ButtonParameters> & ButtonAdditionalProps;

export { default } from './button';

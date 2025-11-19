import { ReactNode, ReactElement } from 'react';
import { TextProps as BaseTextProps } from '@/components/ui/Text';

export type IconLabelProps = {
  icon?: ReactNode;
  children: ReactElement | string;
  textClassName?: string;
  iconClassName?: string;
  className?: string;
  text?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  size?: BaseTextProps['size'];
  color?: string;
  weight?: BaseTextProps['weight'];
  font?: string;
  alignment?: BaseTextProps['alignment'];
  transform?: BaseTextProps['transform'];
  decoration?: BaseTextProps['decoration'];
  letterSpacing?: BaseTextProps['letterSpacing'];
  iconPosition?: 'left' | 'right';
  lineCountRestrictions?: string;
};

export { IconLabel as default } from './icon-label';

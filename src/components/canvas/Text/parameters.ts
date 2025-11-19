import { TextProps as BaseTextProps } from '@/components/ui/Text';

export type TextParameters = {
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
  lineCountRestrictions?: string;
};

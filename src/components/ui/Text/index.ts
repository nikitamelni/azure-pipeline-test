import { ReactElement } from 'react';
import { ViewPort } from '@/types/cskTypes';

export type TextProps = {
  className?: string;
  size?: string | ViewPort<string>;
  color?: string;
  weight?: string;
  font?: string;
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'normal-case';
  decoration?: 'underline' | 'overline' | 'line-through' | 'no-underline';
  letterSpacing?: string;
  children: ReactElement | string;
  alignment?: 'left' | 'center' | 'right';
  lineCountRestrictions?: string;
};

export { Text as default } from './text';

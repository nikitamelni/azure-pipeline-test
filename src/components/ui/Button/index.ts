import { PropsWithChildren, ReactNode } from 'react';
import { ViewPort } from '@/types/cskTypes';

export enum ButtonVariant {
  Link = 'link',
}

export type ButtonProps = PropsWithChildren<{
  variant?: ButtonVariant;
  href?: string;
  border?: string | ViewPort<string>;
  size?: string;
  className?: string;
  textColor?: string;
  textSize?: string | ViewPort<string>;
  textWeight?: string;
  textFont?: 'uppercase' | 'lowercase' | 'capitalize' | 'normal-case';
  textTransform?: string;
  buttonColor?: string;
  isActive?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  hoverButtonColor?: string;
  hoverTextColor?: string;
}>;

export { Button as default } from './button';

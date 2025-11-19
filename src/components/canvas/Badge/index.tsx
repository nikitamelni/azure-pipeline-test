import { ComponentProps } from '@uniformdev/canvas-react';

export type BadgeParameters = {
  text?: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  dotColor?: string;
  pill?: boolean;
  size?: string;
};

export type BadgeProps = ComponentProps<BadgeParameters>;

export { default } from './badge';

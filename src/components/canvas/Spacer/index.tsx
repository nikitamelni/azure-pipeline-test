import { ComponentProps } from '@uniformdev/canvas-react';

export type SpacerParameters = {
  size?: string;
};
export enum SpacerVariants {
  Horizontal = 'horizontal',
}

export type SpacerProps = ComponentProps<SpacerParameters>;

export { default } from './spacer';

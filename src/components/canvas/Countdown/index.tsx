import { ComponentProps } from '@uniformdev/canvas-react';
import { TextProps as BaseTextProps } from '@/components/ui/Text';
import { ViewPort } from '@/types/cskTypes';

type UniformDate = {
  datetime: string;
};

export type CountdownParameters = {
  targetDate?: UniformDate;
  backgroundColor?: string;
  textColor?: string;
  border?: string | ViewPort<string>;
  size?: BaseTextProps['size'];
};

export enum CountdownSlots {
  CountdownComplete = 'countdownComplete',
}

export enum CountdownVariants {
  LabelsUnder = 'labelsUnder',
}

export type CountdownProps = ComponentProps<CountdownParameters>;

export { default } from './countdown';

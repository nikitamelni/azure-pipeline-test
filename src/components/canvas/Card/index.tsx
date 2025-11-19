import { ComponentProps } from '@uniformdev/canvas-react';
import { ContainerParameters } from '@/components/canvas/Container/parameters';

export type CardAdditionalProps = {
  className?: string;
  contentClassName?: string;
};

export type CardParameters = ContainerParameters;

export enum CardVariants {
  BackgroundImage = 'backgroundImage',
}

export enum CardSlots {
  CardMedia = 'cardMedia',
  CardContent = 'cardContent',
}

export type CardProps = ComponentProps<CardParameters> & CardAdditionalProps;

export { default } from './card';

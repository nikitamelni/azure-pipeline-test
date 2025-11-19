import { BannerParameters } from '.';

export enum ContentAlignment {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}

export enum BannerVariants {
  Top = 'top',
  Bottom = 'bottom',
}

export type PositionClassesProps = {
  variant?: BannerVariants;
} & Pick<BannerParameters, 'floating'>;

export type ContentClassesProps = Pick<
  BannerParameters,
  'floating' | 'iconColor' | 'fluidContent' | 'contentAlignment'
>;

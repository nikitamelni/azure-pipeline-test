import { AssetParamValue } from '@uniformdev/assets';
import { LinkParamValue } from '@uniformdev/canvas';
import { ComponentProps } from '@uniformdev/canvas-react';
import { ContainerParameters } from '@/components/canvas/Container/parameters';
import { TextParameters } from '@/components/canvas/Text/parameters';
import { ButtonVariant, ButtonProps as BaseButtonProps } from '@/components/ui/Button';
import { ViewPort } from '@/types/cskTypes';
import FixedHero from './fixed-hero';
import FlexibleHero from './flexible-hero';
import { PrefixedKeys } from './utils';

export enum ContentAlignment {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}

export type BaseButtonParameters = {
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

export type BaseImageParameters = {
  image?: AssetParamValue;
  width?: number;
  height?: number;
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  overlayColor?: string;
  overlayOpacity?: string;
  contrastBaseColor?: string;
  border?: string | ViewPort<string>;
  priority?: boolean;
  unoptimized?: boolean;
  fill?: boolean;
};

export type EyebrowTitleTextParameters = PrefixedKeys<TextParameters, 'eyebrowTitle'>;
export type TitleTextParameters = PrefixedKeys<TextParameters, 'title'>;
export type DescriptionTextParameters = PrefixedKeys<TextParameters, 'description'>;
export type PrimaryButtonParameters = PrefixedKeys<BaseButtonParameters, 'primaryButton'> & {
  primaryButtonVariant?: ButtonVariant;
};
export type SecondaryButtonParameters = PrefixedKeys<BaseButtonParameters, 'secondaryButton'> & {
  secondaryButtonVariant?: ButtonVariant;
};

export type ImageParameters = PrefixedKeys<Omit<BaseImageParameters, 'image'>, 'image'> &
  Pick<BaseImageParameters, 'image'>;

type DemoHeroParameters = ContainerParameters & {
  contentAlignment?: ContentAlignment;
} & EyebrowTitleTextParameters &
  TitleTextParameters &
  DescriptionTextParameters &
  PrimaryButtonParameters &
  SecondaryButtonParameters &
  ImageParameters;

export type FixedHeroParameters = {
  textColor?: string;
  overlayAutoTint?: string;
} & DemoHeroParameters;

export type FlexibleHeroParameters = DemoHeroParameters;

export enum DemoHeroVariants {
  Columns = 'columns',
  ColumnsReverse = 'columnsReverse',
}

export enum FlexibleHeroSlots {
  FlexibleHeroContent = 'flexibleHeroContent',
  FlexibleHeroCta = 'flexibleHeroCta',
}

export type FixedHeroProps = ComponentProps<FixedHeroParameters>;
export type FlexibleHeroProps = ComponentProps<FlexibleHeroParameters>;

const DemoHero = { FixedHero, FlexibleHero };
export default DemoHero;

import { AssetParamValue } from '@uniformdev/assets';
import { LinkParamValue } from '@uniformdev/canvas';
import { ComponentProps } from '@uniformdev/canvas-react';
import { TextParameters } from '@/components/canvas/Text/parameters';
import BaseImage from '@/components/ui/Image';
import InlineSVG from '@/components/ui/InlineSVG';
import { ViewPort } from '@/types/cskTypes';
import { resolveAsset } from '@/utils/assets';
import NavigationFlyoutClient from './navigation-flyout-client';

export type NavigationFlyoutParameters = TextParameters & {
  icon?: AssetParamValue;
  link?: LinkParamValue;
  backgroundColor?: string;
  border?: string | ViewPort<string>;
  caretIcon?: AssetParamValue;
  hoverEffect?: string | ViewPort<string>;
  className?: string;
};

export enum NavigationFlyoutSlots {
  NavigationFlyoutLeftContent = 'navigationFlyoutLeftContent',
  NavigationFlyoutRightContent = 'navigationFlyoutRightContent',
}

export type NavigationFlyoutProps = ComponentProps<NavigationFlyoutParameters>;

const NavigationFlyout = (props: NavigationFlyoutProps) => {
  const [resolvedImage] = resolveAsset(props.icon);
  const { url, title = '' } = resolvedImage || {};

  const renderUrl = () => {
    if (!url) return null;

    return url.endsWith('.svg') ? <InlineSVG src={url} alt={title} fill /> : <BaseImage src={url} alt={title} fill />;
  };

  return <NavigationFlyoutClient {...props} icon={renderUrl()} />;
};

export default NavigationFlyout;

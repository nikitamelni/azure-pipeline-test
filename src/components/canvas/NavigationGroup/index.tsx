import { AssetParamValue } from '@uniformdev/assets';
import { LinkParamValue } from '@uniformdev/canvas';
import { ComponentProps } from '@uniformdev/canvas-react';
import { TextParameters } from '@/components/canvas/Text/parameters';
import BaseImage from '@/components/ui/Image';
import InlineSVG from '@/components/ui/InlineSVG';
import { ViewPort } from '@/types/cskTypes';
import { resolveAsset } from '@/utils/assets';
import NavigationGroupClient from './navigation-group-client';

export type NavigationGroupParameters = TextParameters & {
  icon?: AssetParamValue;
  caretIcon?: AssetParamValue;
  link?: LinkParamValue;
  backgroundColor?: string;
  border?: string | ViewPort<string>;
  hoverEffect?: string | ViewPort<string>;
  className?: string;
};

export enum NavigationGroupSlots {
  Links = 'links',
}

export type NavigationGroupProps = ComponentProps<NavigationGroupParameters>;

const NavigationGroup = (props: NavigationGroupProps) => {
  const [resolvedImage] = resolveAsset(props.icon);
  const { url, title = '' } = resolvedImage || {};

  const renderUrl = () => {
    if (!url) return null;

    return url.endsWith('.svg') ? <InlineSVG src={url} alt={title} fill /> : <BaseImage src={url} alt={title} fill />;
  };

  return <NavigationGroupClient {...props} icon={renderUrl()} />;
};

export default NavigationGroup;

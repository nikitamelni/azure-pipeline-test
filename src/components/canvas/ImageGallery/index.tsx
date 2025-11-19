import { AssetParamValue } from '@uniformdev/assets';
import { ComponentProps } from '@uniformdev/canvas-react';
import { ContainerParameters } from '@/components/canvas/Container/parameters';

export type ImageGalleryParameters = ContainerParameters & {
  aspectRatio?: 'square' | 'video';
  items?: AssetParamValue;
};

export type ImageGalleryAdditionalProps = {
  config?: {
    firstLineCount: number;
    secondLineCount: number;
    otherLinesCount: number;
  };
};

export enum ImageGallerySlots {
  Items = 'imageGalleryItems',
}

export type ImageGalleryProps = ComponentProps<ImageGalleryParameters> & ImageGalleryAdditionalProps;

export { default } from './image-gallery';

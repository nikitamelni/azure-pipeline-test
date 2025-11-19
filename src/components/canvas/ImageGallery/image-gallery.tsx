import { FC } from 'react';
import { AssetParamValue } from '@uniformdev/assets';
import { flattenValues } from '@uniformdev/canvas';
import CanvasImage from '@/components/canvas/Image';
import Container from '@/components/ui/Container';
import BaseImage from '@/components/ui/Image';
import { ImageGalleryProps, ImageGallerySlots } from '.';
import { GalleryInner } from './gallery-inner';

const ImageGallery: FC<ImageGalleryProps> = ({
  backgroundColor,
  spacing,
  border,
  fluidContent,
  height,
  aspectRatio,
  config,
  items,
  component,
}) => {
  const slotsToRender = {
    items: !items?.length
      ? component?.slots?.[ImageGallerySlots.Items]?.map((item, index) => {
          return {
            _id: `image-${index}-${item?._id}`,
            component: (
              <CanvasImage
                {...(flattenValues(item) as {
                  width?: number;
                  height?: number;
                  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
                  overlayColor?: string;
                  overlayOpacity?: string;
                })}
                image={item?.parameters?.image?.value as AssetParamValue}
                component={item}
              />
            ),
          };
        })
      : items.map((item, index) => ({
          _id: `image-${index}-${item?._id}`,
          component: (
            <BaseImage
              src={item.fields?.url?.value}
              alt={item.fields?.title?.value || ''}
              style={{ objectFit: 'cover' }}
              fill
            />
          ),
        })),
  };

  return (
    <Container {...{ backgroundColor, spacing, border, fluidContent, height }}>
      <div className="flex flex-col gap-1">
        <GalleryInner slot={slotsToRender} aspectRatio={aspectRatio} config={config} />
      </div>
    </Container>
  );
};

export default ImageGallery;

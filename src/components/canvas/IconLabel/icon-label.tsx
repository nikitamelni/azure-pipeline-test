import { FC } from 'react';
import { UniformText } from '@uniformdev/canvas-react';
import BaseIconLabel from '@/components/ui/IconLabel';
import BaseImage from '@/components/ui/Image';
import { resolveAsset } from '@/utils/assets';
import { IconLabelProps } from '.';

const IconLabel: FC<IconLabelProps> = ({
  icon,
  size,
  tag,
  color,
  weight,
  font,
  transform,
  decoration,
  letterSpacing,
  alignment,
  iconPosition,
}) => {
  const [resolvedImage] = resolveAsset(icon);
  const { url, title = '' } = resolvedImage || {};

  return (
    <BaseIconLabel
      icon={url ? <BaseImage src={url} alt={title} fill /> : undefined}
      {...{ size, tag, color, weight, font, transform, decoration, letterSpacing, alignment, iconPosition }}
    >
      <UniformText placeholder="Text goes here" parameterId="text" />
    </BaseIconLabel>
  );
};

export default IconLabel;

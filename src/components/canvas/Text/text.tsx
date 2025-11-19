import { FC } from 'react';
import { UniformText } from '@uniformdev/canvas-react';
import BaseText from '@/components/ui/Text';
import { TextProps } from '.';

const Text: FC<TextProps> = ({
  tag,
  size,
  color,
  weight,
  font,
  transform,
  decoration,
  letterSpacing,
  lineCountRestrictions,
  alignment,
}) => (
  <BaseText {...{ color, size, font, weight, transform, decoration, letterSpacing, alignment, lineCountRestrictions }}>
    <UniformText placeholder="Text goes here" parameterId="text" as={tag || undefined} />
  </BaseText>
);

export default Text;

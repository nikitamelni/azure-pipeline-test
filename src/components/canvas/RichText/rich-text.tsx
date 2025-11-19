import { FC } from 'react';
import { UniformRichText } from '@uniformdev/canvas-react';
import BaseText from '@/components/ui/Text';
import { cn, resolveViewPort } from '@/utils/styling';
import { RichTextProps, RichTextParameters, RichTextAdditionalProps } from '.';

const RichText: FC<RichTextProps & RichTextParameters & RichTextAdditionalProps> = ({
  color,
  lineCountRestrictions,
  font,
  size,
  className,
}) => (
  <BaseText lineCountRestrictions={lineCountRestrictions} color={color} font={font}>
    <UniformRichText
      className={cn(
        'prose max-w-full marker:text-current [&_*:not(pre)]:text-current',
        {
          [resolveViewPort(size, 'prose-{value}')]: size,
        },
        className
      )}
      parameterId="text"
      placeholder="Rich text content goes here..."
    />
  </BaseText>
);

export default RichText;

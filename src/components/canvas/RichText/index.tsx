import { ComponentProps } from '@uniformdev/canvas-react';
import { RichTextNode } from '@uniformdev/richtext';

type Size = 'sm' | 'base' | 'lg' | 'xl' | '2xl';

export type RichTextAdditionalProps = {
  className?: string;
};

export type RichTextParameters = {
  text?: RichTextNode;
  size?: Size;
  color?: string;
  font?: string;
  lineCountRestrictions?: string;
};

export { default } from './rich-text';
export type RichTextProps = ComponentProps<RichTextParameters> & RichTextAdditionalProps;

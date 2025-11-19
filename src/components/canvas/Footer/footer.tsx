import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import BaseFooter from '@/components/ui/Footer';
import { FooterProps, FooterSlots } from '.';

export const Footer: FC<FooterProps> = ({ backgroundColor, spacing, border, fluidContent }) => (
  <BaseFooter
    logo={<UniformSlot name={FooterSlots.FooterLogo} emptyPlaceholder={<div className="h-20 w-48" />} />}
    copyright={<UniformSlot name={FooterSlots.FooterCopyright} emptyPlaceholder={<div className="h-20 w-48" />} />}
    content={<UniformSlot name={FooterSlots.FooterContent} emptyPlaceholder={<div className="h-20 w-48" />} />}
    {...{ backgroundColor, spacing, border, fluidContent }}
  />
);

export default Footer;

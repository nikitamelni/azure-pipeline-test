import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import BaseLink from '@/components/ui/Link';
import { formatUniformLink } from '@/utils/routing';
import { LinkProps, LinkSlots } from '.';

export const Link: FC<LinkProps> = ({ link, openInNewTab }) => (
  <BaseLink link={formatUniformLink(link)} openInNewTab={openInNewTab}>
    <UniformSlot name={LinkSlots.LinkContent} />
  </BaseLink>
);

export default Link;

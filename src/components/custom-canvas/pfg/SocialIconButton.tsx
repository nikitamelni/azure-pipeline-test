import { FC } from 'react';
import Image from 'next/image';
import { AssetParamValue } from '@uniformdev/assets';
import { LinkParamValue } from '@uniformdev/canvas';
import { ComponentProps } from '@uniformdev/canvas-react';
import { resolveAsset } from '@uniformdev/csk-components/utils/assets';
import { formatUniformLink } from '@uniformdev/csk-components/utils/routing';

export type SocialIconButtonParameters = {
  icon?: AssetParamValue;
  link?: LinkParamValue;
  ariaLabel?: string;
};

type SocialIconButtonProps = ComponentProps<SocialIconButtonParameters>;

const SocialIconButton: FC<SocialIconButtonProps> = ({ icon, link, ariaLabel }) => {
  const [resolvedIcon] = resolveAsset(icon);
  const href = formatUniformLink(link);

  if (!resolvedIcon?.url && !href) return null;

  const content = resolvedIcon?.url ? (
    <Image src={resolvedIcon.url} alt={ariaLabel || ''} width={24} height={24} className="h-6 w-6 object-contain" />
  ) : null;

  if (href) {
    return (
      <a
        href={href}
        aria-label={ariaLabel}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
      >
        {content}
      </a>
    );
  }

  return (
    <span aria-label={ariaLabel} className="inline-flex h-10 w-10 items-center justify-center">
      {content}
    </span>
  );
};

export default SocialIconButton;

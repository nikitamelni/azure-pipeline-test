import { FC } from 'react';
import Image from 'next/image';
import { AssetParamValue } from '@uniformdev/assets';
import { ComponentProps, UniformSlot, UniformText } from '@uniformdev/canvas-react';
import { resolveAsset } from '@uniformdev/csk-components/utils/assets';

export type PfgHeaderParameters = {
  logo?: AssetParamValue;
  logoAltText?: string;
  cartText?: string;
  cartIcon?: AssetParamValue;
  cartIconAltText?: string;
};

enum PfgHeaderSlots {
  Navigation = 'navigation',
}

type PfgHeaderProps = ComponentProps<PfgHeaderParameters>;

const PfgHeader: FC<PfgHeaderProps> = ({ logo, logoAltText, cartIcon, cartIconAltText }) => {
  const [resolvedLogo] = resolveAsset(logo);
  const [resolvedCartIcon] = resolveAsset(cartIcon);

  return (
    <header className="flex w-full items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center gap-6">
        {resolvedLogo?.url && (
          <Image
            src={resolvedLogo.url}
            alt={logoAltText || ''}
            width={resolvedLogo.width || 160}
            height={resolvedLogo.height || 40}
            className="h-10 w-auto object-contain"
          />
        )}
        <nav className="flex items-center gap-4">
          <UniformSlot name={PfgHeaderSlots.Navigation} />
        </nav>
      </div>
      <div className="flex items-center gap-2">
        {resolvedCartIcon?.url && (
          <Image
            src={resolvedCartIcon.url}
            alt={cartIconAltText || ''}
            width={24}
            height={24}
            className="h-6 w-6 object-contain"
          />
        )}
        <UniformText parameterId="cartText" placeholder="Cart" />
      </div>
    </header>
  );
};

export default PfgHeader;

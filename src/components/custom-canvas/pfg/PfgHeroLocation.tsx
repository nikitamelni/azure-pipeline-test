import { FC } from 'react';
import Image from 'next/image';
import { AssetParamValue } from '@uniformdev/assets';
import { ComponentProps, UniformSlot, UniformText } from '@uniformdev/canvas-react';
import { resolveAsset } from '@uniformdev/csk-components/utils/assets';

export type PfgHeroLocationParameters = {
  displayName?: string;
  backgroundImage?: AssetParamValue;
  showOverlay?: boolean;
  locationHeading?: string;
  locationSubhead?: string;
  stateImage?: AssetParamValue;
  stateImageWidth?: string;
};

enum PfgHeroLocationSlots {
  Buttons = 'buttons',
  SocialIcons = 'socialIcons',
}

type PfgHeroLocationProps = ComponentProps<PfgHeroLocationParameters>;

const PfgHeroLocation: FC<PfgHeroLocationProps> = ({ backgroundImage, showOverlay, stateImage, stateImageWidth }) => {
  const [resolvedBackground] = resolveAsset(backgroundImage);
  const [resolvedStateImage] = resolveAsset(stateImage);

  const stateImageMaxWidth = typeof stateImageWidth === 'string' ? stateImageWidth : undefined;

  return (
    <section
      className="relative w-full bg-gray-800 bg-cover bg-center px-6 py-20 text-white"
      style={resolvedBackground?.url ? { backgroundImage: `url(${resolvedBackground.url})` } : undefined}
    >
      {showOverlay && <div className="absolute inset-0 bg-black/60" />}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start gap-6">
        <div className="flex items-center gap-4">
          {resolvedStateImage?.url && (
            <Image
              src={resolvedStateImage.url}
              alt=""
              width={resolvedStateImage.width || 80}
              height={resolvedStateImage.height || 80}
              className="h-auto w-full object-contain"
              style={stateImageMaxWidth ? { maxWidth: stateImageMaxWidth } : { maxWidth: '80px' }}
            />
          )}
          <UniformText
            parameterId="locationHeading"
            as="h1"
            className="text-3xl font-bold md:text-5xl"
            placeholder="Location heading"
          />
        </div>
        <UniformText
          parameterId="locationSubhead"
          as="p"
          className="max-w-2xl text-lg"
          placeholder="Location subhead"
        />
        <div className="flex flex-wrap items-center gap-3">
          <UniformSlot name={PfgHeroLocationSlots.Buttons} />
        </div>
        <div className="flex items-center gap-3">
          <UniformSlot name={PfgHeroLocationSlots.SocialIcons} />
        </div>
      </div>
    </section>
  );
};

export default PfgHeroLocation;

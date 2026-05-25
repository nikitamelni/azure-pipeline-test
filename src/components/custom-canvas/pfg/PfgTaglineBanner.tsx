import { FC } from 'react';
import Image from 'next/image';
import { AssetParamValue } from '@uniformdev/assets';
import { ComponentProps, UniformText } from '@uniformdev/canvas-react';
import { resolveAsset } from '@uniformdev/csk-components/utils/assets';

export type PfgTaglineBannerParameters = {
  displayName?: string;
  text?: string;
  textWidth?: string;
  textOffsetY?: string;
  textOffsetYMobile?: string;
  leftImage?: AssetParamValue;
  leftImageOffsetY?: string;
  rightImage?: AssetParamValue;
  rightImageOffsetY?: string;
  centerImage?: AssetParamValue;
  centerImageWidth?: string;
  centerImageOffsetY?: string;
  centerImageOffsetYMobile?: string;
  centerImageRotation?: string;
};

type PfgTaglineBannerProps = ComponentProps<PfgTaglineBannerParameters>;

const PfgTaglineBanner: FC<PfgTaglineBannerProps> = ({
  leftImage,
  rightImage,
  centerImage,
  centerImageWidth,
  centerImageRotation,
}) => {
  const [resolvedLeft] = resolveAsset(leftImage);
  const [resolvedRight] = resolveAsset(rightImage);
  const [resolvedCenter] = resolveAsset(centerImage);

  const centerWidth = typeof centerImageWidth === 'string' ? centerImageWidth : undefined;
  const centerRotation = typeof centerImageRotation === 'string' ? `${centerImageRotation}` : undefined;

  return (
    <section className="relative w-full overflow-visible bg-white px-6 py-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {resolvedLeft?.url && (
          <Image
            src={resolvedLeft.url}
            alt=""
            width={resolvedLeft.width || 128}
            height={resolvedLeft.height || 128}
            className="h-auto w-24 flex-shrink-0 object-contain md:w-32"
          />
        )}
        <div className="relative flex flex-1 flex-col items-center text-center">
          <UniformText
            parameterId="text"
            as="p"
            className="text-2xl font-semibold md:text-3xl"
            placeholder="Tagline text"
          />
          {resolvedCenter?.url && (
            <Image
              src={resolvedCenter.url}
              alt=""
              width={resolvedCenter.width || 80}
              height={resolvedCenter.height || 80}
              className="mt-2 h-auto object-contain"
              style={{
                maxWidth: centerWidth || '80px',
                transform: centerRotation ? `rotate(${centerRotation}deg)` : undefined,
              }}
            />
          )}
        </div>
        {resolvedRight?.url && (
          <Image
            src={resolvedRight.url}
            alt=""
            width={resolvedRight.width || 128}
            height={resolvedRight.height || 128}
            className="hidden h-auto w-24 flex-shrink-0 object-contain md:block md:w-32"
          />
        )}
      </div>
    </section>
  );
};

export default PfgTaglineBanner;

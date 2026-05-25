import { FC } from 'react';
import Image from 'next/image';
import { AssetParamValue } from '@uniformdev/assets';
import { ComponentProps, UniformText } from '@uniformdev/canvas-react';
import { resolveAsset } from '@uniformdev/csk-components/utils/assets';

export type PfgHeroDefaultParameters = {
  displayName?: string;
  backgroundImage?: AssetParamValue;
  showOverlay?: boolean;
  text?: string;
  foregroundImage?: AssetParamValue;
  foregroundImageWidth?: string;
};

type PfgHeroDefaultProps = ComponentProps<PfgHeroDefaultParameters>;

const PfgHeroDefault: FC<PfgHeroDefaultProps> = ({
  backgroundImage,
  showOverlay,
  foregroundImage,
  foregroundImageWidth,
}) => {
  const [resolvedBackground] = resolveAsset(backgroundImage);
  const [resolvedForeground] = resolveAsset(foregroundImage);

  const foregroundMaxWidth = typeof foregroundImageWidth === 'string' ? foregroundImageWidth : undefined;

  return (
    <section
      className="relative flex min-h-[400px] w-full items-center justify-center bg-gray-800 bg-cover bg-center px-6 py-20 text-white"
      style={resolvedBackground?.url ? { backgroundImage: `url(${resolvedBackground.url})` } : undefined}
    >
      {showOverlay && <div className="absolute inset-0 bg-black/60" />}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <UniformText parameterId="text" as="h1" className="text-4xl font-bold md:text-5xl" placeholder="Headline" />
        {resolvedForeground?.url && (
          <Image
            src={resolvedForeground.url}
            alt=""
            width={resolvedForeground.width || 400}
            height={resolvedForeground.height || 200}
            className="h-auto w-full object-contain"
            style={foregroundMaxWidth ? { maxWidth: foregroundMaxWidth } : undefined}
          />
        )}
      </div>
    </section>
  );
};

export default PfgHeroDefault;

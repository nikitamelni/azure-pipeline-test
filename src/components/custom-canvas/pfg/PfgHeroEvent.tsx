import { FC } from 'react';
import Image from 'next/image';
import { AssetParamValue } from '@uniformdev/assets';
import { ComponentProps, UniformSlot, UniformText } from '@uniformdev/canvas-react';
import { resolveAsset } from '@uniformdev/csk-components/utils/assets';

export type PfgHeroEventParameters = {
  displayName?: string;
  backgroundImage?: AssetParamValue;
  showOverlay?: boolean;
  eyebrowText?: string;
  headerImage?: AssetParamValue;
  headerImageWidth?: string;
  eventTimeLocation?: string;
  eventDetails?: string;
};

enum PfgHeroEventSlots {
  Buttons = 'buttons',
}

type PfgHeroEventProps = ComponentProps<PfgHeroEventParameters>;

const PfgHeroEvent: FC<PfgHeroEventProps> = ({ backgroundImage, showOverlay, headerImage, headerImageWidth }) => {
  const [resolvedBackground] = resolveAsset(backgroundImage);
  const [resolvedHeaderImage] = resolveAsset(headerImage);

  const headerImageMaxWidth = typeof headerImageWidth === 'string' ? headerImageWidth : undefined;

  return (
    <section
      className="relative w-full bg-gray-800 bg-cover bg-center px-6 py-16 text-white"
      style={resolvedBackground?.url ? { backgroundImage: `url(${resolvedBackground.url})` } : undefined}
    >
      {showOverlay && <div className="absolute inset-0 bg-black/60" />}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <UniformText
          parameterId="eyebrowText"
          as="span"
          className="text-sm font-semibold uppercase tracking-widest"
          placeholder="Eyebrow"
        />
        {resolvedHeaderImage?.url && (
          <Image
            src={resolvedHeaderImage.url}
            alt=""
            width={resolvedHeaderImage.width || 400}
            height={resolvedHeaderImage.height || 200}
            className="h-auto w-full object-contain"
            style={headerImageMaxWidth ? { maxWidth: headerImageMaxWidth } : { maxWidth: '400px' }}
          />
        )}
        <UniformText
          parameterId="eventTimeLocation"
          as="p"
          className="text-xl font-semibold"
          placeholder="Event time & location"
        />
        <UniformText parameterId="eventDetails" as="p" className="text-base" placeholder="Event details" />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <UniformSlot name={PfgHeroEventSlots.Buttons} />
        </div>
      </div>
    </section>
  );
};

export default PfgHeroEvent;

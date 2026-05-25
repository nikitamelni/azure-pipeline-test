import { FC } from 'react';
import Image from 'next/image';
import { AssetParamValue } from '@uniformdev/assets';
import { RichTextParamValue } from '@uniformdev/canvas';
import { ComponentProps, UniformRichText, UniformText } from '@uniformdev/canvas-react';
import { resolveAsset } from '@uniformdev/csk-components/utils/assets';

export type PfgIntroWithImageParameters = {
  displayName?: string;
  eyebrow?: string;
  heading?: string;
  content?: RichTextParamValue;
  image?: AssetParamValue;
  imageAlt?: string;
  imageScale?: string;
};

type PfgIntroWithImageProps = ComponentProps<PfgIntroWithImageParameters>;

const PfgIntroWithImage: FC<PfgIntroWithImageProps> = ({ image, imageAlt, imageScale }) => {
  const [resolvedImage] = resolveAsset(image);
  const scale = typeof imageScale === 'string' ? parseFloat(imageScale) / 100 : undefined;

  return (
    <section className="w-full px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center">
        {resolvedImage?.url && (
          <div className="hidden flex-shrink-0 md:block">
            <Image
              src={resolvedImage.url}
              alt={imageAlt || ''}
              width={resolvedImage.width || 320}
              height={resolvedImage.height || 320}
              className="h-auto w-full max-w-xs object-contain"
              style={scale ? { transform: `scale(${scale})`, transformOrigin: 'top left' } : undefined}
            />
          </div>
        )}
        <div className="flex flex-col gap-3">
          <UniformText
            parameterId="eyebrow"
            as="span"
            className="text-sm font-semibold uppercase tracking-widest text-red-700"
            placeholder="Eyebrow"
          />
          <UniformText parameterId="heading" as="h2" className="text-3xl font-bold md:text-4xl" placeholder="Heading" />
          <div className="prose max-w-none">
            <UniformRichText parameterId="content" placeholder="Body content" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PfgIntroWithImage;

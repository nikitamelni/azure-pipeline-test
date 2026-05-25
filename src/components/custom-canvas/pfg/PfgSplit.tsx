import { FC } from 'react';
import Image from 'next/image';
import { AssetParamValue } from '@uniformdev/assets';
import { RichTextParamValue } from '@uniformdev/canvas';
import { ComponentProps, UniformRichText, UniformSlot, UniformText } from '@uniformdev/canvas-react';
import { resolveAsset } from '@uniformdev/csk-components/utils/assets';
import { cn } from '@/utils/styling';

export type PfgSplitParameters = {
  displayName?: string;
  image?: AssetParamValue;
  imageSide?: 'left' | 'right';
  eyebrow?: string;
  heading?: string;
  content?: RichTextParamValue;
};

enum PfgSplitSlots {
  Buttons = 'buttons',
}

type PfgSplitProps = ComponentProps<PfgSplitParameters>;

const PfgSplit: FC<PfgSplitProps> = ({ image, imageSide }) => {
  const [resolvedImage] = resolveAsset(image);
  const isImageRight = imageSide === 'right';

  return (
    <section className="w-full px-6 py-12">
      <div
        className={cn(
          'mx-auto grid max-w-7xl gap-8 md:grid-cols-2 md:items-center',
          isImageRight ? 'md:[&>div:first-child]:order-1' : ''
        )}
      >
        <div>
          {resolvedImage?.url && (
            <Image
              src={resolvedImage.url}
              alt=""
              width={resolvedImage.width || 600}
              height={resolvedImage.height || 400}
              className="h-auto w-full rounded object-cover"
            />
          )}
        </div>
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
          <div className="mt-2 flex flex-wrap gap-3">
            <UniformSlot name={PfgSplitSlots.Buttons} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PfgSplit;

import { FC } from 'react';
import Image from 'next/image';
import { AssetParamValue } from '@uniformdev/assets';
import { RichTextParamValue } from '@uniformdev/canvas';
import { ComponentProps, UniformRichText, UniformText } from '@uniformdev/canvas-react';
import { resolveAsset } from '@uniformdev/csk-components/utils/assets';

export type PfgFeatureListParameters = {
  displayName?: string;
  image?: AssetParamValue;
  imageAlt?: string;
  title?: string;
  description?: RichTextParamValue;
};

type PfgFeatureListProps = ComponentProps<PfgFeatureListParameters>;

const PfgFeatureList: FC<PfgFeatureListProps> = ({ image, imageAlt }) => {
  const [resolvedImage] = resolveAsset(image);

  return (
    <article className="flex flex-col gap-4 p-4 md:flex-row md:items-start">
      {resolvedImage?.url && (
        <Image
          src={resolvedImage.url}
          alt={imageAlt || ''}
          width={130}
          height={130}
          className="h-[130px] w-[130px] flex-shrink-0 object-contain"
        />
      )}
      <div className="flex flex-col gap-2">
        <UniformText parameterId="title" as="h3" className="text-xl font-semibold" placeholder="Feature title" />
        <div className="prose max-w-none text-base">
          <UniformRichText parameterId="description" placeholder="Feature description" />
        </div>
      </div>
    </article>
  );
};

export default PfgFeatureList;

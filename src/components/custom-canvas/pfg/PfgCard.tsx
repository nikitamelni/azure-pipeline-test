import { FC } from 'react';
import Image from 'next/image';
import { AssetParamValue } from '@uniformdev/assets';
import { LinkParamValue } from '@uniformdev/canvas';
import { ComponentProps, UniformText } from '@uniformdev/canvas-react';
import { resolveAsset } from '@uniformdev/csk-components/utils/assets';
import { formatUniformLink } from '@uniformdev/csk-components/utils/routing';

export type PfgCardParameters = {
  displayName?: string;
  image?: AssetParamValue;
  imageAlt?: string;
  link?: LinkParamValue;
  buttonText?: string;
};

type PfgCardProps = ComponentProps<PfgCardParameters>;

const PfgCard: FC<PfgCardProps> = ({ image, imageAlt, link, component }) => {
  const [resolvedImage] = resolveAsset(image);
  const href = formatUniformLink(link);
  const variant = component?.variant;
  const hideButton = variant === 'noButton';
  const isSquare = variant === 'square';

  return (
    <article className="flex w-full max-w-sm flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {resolvedImage?.url && (
        <a href={href || '#'} className="relative block">
          <div className={`relative w-full ${isSquare ? 'aspect-square' : 'aspect-video'}`}>
            <Image src={resolvedImage.url} alt={imageAlt || ''} fill className="object-cover" />
          </div>
        </a>
      )}
      {!hideButton && (
        <div className="flex items-center justify-center p-4">
          {href ? (
            <a
              href={href}
              className="inline-flex items-center justify-center rounded bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              <UniformText parameterId="buttonText" placeholder="Learn more" />
            </a>
          ) : (
            <UniformText parameterId="buttonText" as="span" className="text-sm font-semibold" placeholder="Button" />
          )}
        </div>
      )}
    </article>
  );
};

export default PfgCard;

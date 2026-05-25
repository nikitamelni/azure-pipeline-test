import { FC } from 'react';
import Image from 'next/image';
import { AssetParamValue } from '@uniformdev/assets';
import { RichTextParamValue } from '@uniformdev/canvas';
import { ComponentProps, UniformRichText, UniformText } from '@uniformdev/canvas-react';
import { resolveAsset } from '@uniformdev/csk-components/utils/assets';

export type PfgOpCoContactFormParameters = {
  title?: string;
  description?: string;
  logo?: AssetParamValue;
  bgImage?: AssetParamValue;
  disclaimer?: RichTextParamValue;
  formId?: string;
  submitSuccessMessage?: string;
  submitFailureMessage?: string;
};

type PfgOpCoContactFormProps = ComponentProps<PfgOpCoContactFormParameters>;

const PfgOpCoContactForm: FC<PfgOpCoContactFormProps> = ({ logo, bgImage, formId }) => {
  const [resolvedLogo] = resolveAsset(logo);
  const [resolvedBg] = resolveAsset(bgImage);

  return (
    <section className="w-full px-6 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-lg border border-gray-200 md:grid-cols-2">
        <div className="flex flex-col gap-4 p-8">
          {resolvedLogo?.url && (
            <Image
              src={resolvedLogo.url}
              alt=""
              width={resolvedLogo.width || 200}
              height={resolvedLogo.height || 48}
              className="h-12 w-auto self-start object-contain"
            />
          )}
          <UniformText
            parameterId="title"
            as="h2"
            className="text-2xl font-bold md:text-3xl"
            placeholder="Form title"
          />
          <UniformText parameterId="description" as="p" className="text-base" placeholder="Form description" />
          <div
            className="flex min-h-[200px] items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600"
            data-form-id={formId || ''}
          >
            Contact form{formId ? ` (${formId})` : ''} placeholder
          </div>
          <div className="prose max-w-none text-xs text-gray-500">
            <UniformRichText parameterId="disclaimer" placeholder="Disclaimer" />
          </div>
        </div>
        <div
          className="min-h-[300px] bg-gray-200 bg-cover bg-center"
          style={resolvedBg?.url ? { backgroundImage: `url(${resolvedBg.url})` } : undefined}
        />
      </div>
    </section>
  );
};

export default PfgOpCoContactForm;

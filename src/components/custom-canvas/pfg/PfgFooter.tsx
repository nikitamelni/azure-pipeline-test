import { FC } from 'react';
import { RichTextParamValue } from '@uniformdev/canvas';
import { ComponentProps, UniformRichText, UniformSlot } from '@uniformdev/canvas-react';

export type PfgFooterParameters = {
  description?: RichTextParamValue;
  copyright?: RichTextParamValue;
  displayName?: string;
};

enum PfgFooterSlots {
  Content = 'content',
}

type PfgFooterProps = ComponentProps<PfgFooterParameters>;

const PfgFooter: FC<PfgFooterProps> = () => (
  <footer className="w-full bg-gray-900 px-6 py-12 text-white">
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="text-lg">
        <UniformRichText parameterId="description" placeholder="Footer description" />
      </div>
      <div>
        <UniformSlot name={PfgFooterSlots.Content} />
      </div>
      <div className="border-t border-gray-700 pt-6 text-sm text-gray-300">
        <UniformRichText parameterId="copyright" placeholder="Copyright text" />
      </div>
    </div>
  </footer>
);

export default PfgFooter;

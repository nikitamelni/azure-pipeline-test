import { FC } from 'react';
import { ComponentProps, UniformText } from '@uniformdev/canvas-react';

export type PfgSectionHeaderParameters = {
  displayName?: string;
  eyebrow?: string;
  title?: string;
};

type PfgSectionHeaderProps = ComponentProps<PfgSectionHeaderParameters>;

const PfgSectionHeader: FC<PfgSectionHeaderProps> = () => (
  <header className="flex w-full flex-col gap-2 px-6 py-8 text-center">
    <UniformText
      parameterId="eyebrow"
      as="span"
      className="text-sm font-semibold uppercase tracking-widest text-red-700"
      placeholder="Eyebrow"
    />
    <UniformText parameterId="title" as="h2" className="text-3xl font-bold md:text-4xl" placeholder="Section title" />
  </header>
);

export default PfgSectionHeader;

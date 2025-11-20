import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import { ComponentProps } from '@uniformdev/canvas-react';

export type SectionAlignerParameters = {
  displayName?: string;
};

enum SectionAlignerSlots {
  Content = 'content',
}

type SectionAlignerProps = ComponentProps<SectionAlignerParameters>;

const SectionAligner: FC<SectionAlignerProps & SectionAlignerParameters> = () => (
  <div className="absolute bottom-[123px] top-[60px] flex flex-col justify-center">
    <UniformSlot name={SectionAlignerSlots.Content} />
  </div>
);

export default SectionAligner;

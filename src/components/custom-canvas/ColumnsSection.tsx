import { FC } from 'react';
import { UniformSlot } from '@uniformdev/canvas-react';
import { ComponentProps } from '@uniformdev/canvas-react';
import { ViewPort, SpaceType } from '@uniformdev/csk-components/types/cskTypes';
import BaseColumnsSection from '../custom-ui/ColumnsSection';

type ColumnsSectionProps = ComponentProps & {
  leftColumnBackground: string;
  rightColumnBackground: string;
  leftColumnSpacing: SpaceType | ViewPort<SpaceType>;
  rightColumnSpacing: SpaceType | ViewPort<SpaceType>;
};
enum ColumnsSectionSlots {
  LeftColumn = 'leftColumn',
  RightColumn = 'rightColumn',
}

const ColumnsSection: FC<ColumnsSectionProps> = ({
  leftColumnBackground,
  rightColumnBackground,
  leftColumnSpacing,
  rightColumnSpacing,
}) => {
  return (
    <BaseColumnsSection
      leftColumnContent={<UniformSlot name={ColumnsSectionSlots.LeftColumn} />}
      rightColumnContent={<UniformSlot name={ColumnsSectionSlots.RightColumn} />}
      leftColumnBackground={leftColumnBackground}
      rightColumnBackground={rightColumnBackground}
      leftColumnSpacing={leftColumnSpacing}
      rightColumnSpacing={rightColumnSpacing}
    />
  );
};

export default ColumnsSection;

import { FC } from 'react';
import { SpaceType, ViewPort } from '@uniformdev/csk-components/types/cskTypes';
import { cn } from '@/utils/styling';
import Container from '../ui/Container';

type ColumnsSectionProps = {
  leftColumnContent: React.ReactNode;
  rightColumnContent: React.ReactNode;

  leftColumnBackground: string;
  leftColumnSpacing: SpaceType | ViewPort<SpaceType>;
  rightColumnBackground: string;
  rightColumnSpacing: SpaceType | ViewPort<SpaceType>;
};

const ColumnsSection: FC<ColumnsSectionProps> = ({
  leftColumnContent,
  rightColumnContent,
  leftColumnBackground,
  leftColumnSpacing,
  rightColumnBackground,
  rightColumnSpacing,
}) => {
  return (
    <div className="flex h-auto">
      <Container
        fluidContent
        backgroundColor={leftColumnBackground}
        spacing={leftColumnSpacing}
        className={cn(
          'fixed w-[30%] min-w-[360px] max-w-[568px] lg:min-w-[568px] h-screen flex justify-center items-center'
        )}
      >
        <div className="w-full relative flex flex-col justify-end">{leftColumnContent}</div>
      </Container>
      <Container
        fluidContent
        backgroundColor={rightColumnBackground}
        spacing={rightColumnSpacing}
        wrapperClassName={cn(
          'left-[360px] lg:left-[568px] w-full max-w-[70%] lg:max-w-[calc(100%-568px)] min-h-screen h-auto relative flex items-start'
        )}
        className={cn('w-full h-full')}
      >
        {rightColumnContent}
      </Container>
    </div>
  );
};

export default ColumnsSection;

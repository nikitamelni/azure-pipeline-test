import { FC, useCallback, useState } from 'react';
import Container from '@/components/ui/Container';
import { cn } from '@/utils/styling';
import { AccordionItemProps } from '.';
import { IconArrowDown } from './icon-arrow-down';
import { IconArrowUp } from './icon-arrow-up';

export const AccordionItem: FC<AccordionItemProps> = ({
  text,
  backgroundColor,
  spacing,
  className,
  accordionItemContent,
}) => {
  const [isOpened, setOpened] = useState(false);
  const toggleOpenAccordion = useCallback(() => setOpened(isOpened => !isOpened), []);

  return (
    <Container {...{ fluidContent: true }}>
      <Container {...{ backgroundColor, spacing, fluidContent: true, className }}>
        <button
          onClick={toggleOpenAccordion}
          className="flex w-full cursor-pointer flex-row items-center justify-between text-start"
        >
          {text}
          <div
            className={cn({
              [`text-${backgroundColor} invert`]: !!backgroundColor,
              'text-black dark:text-white': !backgroundColor,
            })}
          >
            {isOpened ? <IconArrowDown /> : <IconArrowUp />}
          </div>
        </button>
      </Container>
      {isOpened && accordionItemContent}
    </Container>
  );
};

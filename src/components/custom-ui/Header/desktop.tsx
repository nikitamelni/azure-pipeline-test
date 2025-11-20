import { FC } from 'react';
import BaseContainer from '@/components/ui/Container';
import { ViewPort } from '@/types/cskTypes';
import { SpaceType } from '@/types/cskTypes';
import { HeaderProps } from './';

export const DesktopHeader: FC<HeaderProps> = ({
  leftSection,
  children,
  leftSectionBackgroundColor,
  rightSectionBackgroundColor,
  spacing,
  border,
}) => {
  return (
    <nav>
      <BaseContainer
        fluidContent
        wrapperClassName="w-full"
        className="flex"
        {...{
          border,
          spacing: {
            mobile: {
              ...(spacing as ViewPort<SpaceType>)?.mobile,
              marginTop: '0',
              marginBottom: '0',
              paddingTop: '0',
              paddingBottom: '0',
            },
            tablet: {
              ...(spacing as ViewPort<SpaceType>)?.tablet,
              marginTop: '0',
              marginBottom: '0',
              paddingTop: '0',
              paddingBottom: '0',
            },
            desktop: {
              ...(spacing as ViewPort<SpaceType>)?.desktop,
              marginTop: '0',
              marginBottom: '0',
              paddingTop: '0',
              paddingBottom: '0',
            },
          },
        }}
      >
        {
          <BaseContainer
            fluidContent
            spacing={{
              mobile: {
                ...(spacing as ViewPort<SpaceType>)?.mobile,
                marginLeft: '0',
                marginRight: '0',
                paddingLeft: '0',
                paddingRight: '0',
              },
              tablet: {
                ...(spacing as ViewPort<SpaceType>)?.tablet,
                marginLeft: '0',
                marginRight: '0',
                paddingLeft: '0',
                paddingRight: '0',
              },
              desktop: {
                ...(spacing as ViewPort<SpaceType>)?.desktop,
                marginLeft: '0',
                marginRight: '0',
                paddingLeft: '0',
                paddingRight: '0',
              },
            }}
            wrapperClassName="w-[30%] min-w-[360px] max-w-[568px] lg:min-w-[568px]"
            backgroundColor={leftSectionBackgroundColor}
          >
            {leftSection}
          </BaseContainer>
        }

        <BaseContainer
          fluidContent
          spacing={{
            mobile: {
              ...(spacing as ViewPort<SpaceType>)?.mobile,
              marginLeft: '0',
              marginRight: '0',
              paddingLeft: '0',
              paddingRight: '0',
            },
            tablet: {
              ...(spacing as ViewPort<SpaceType>)?.tablet,
              marginLeft: '0',
              marginRight: '0',
              paddingLeft: '0',
              paddingRight: '0',
            },
            desktop: {
              ...(spacing as ViewPort<SpaceType>)?.desktop,
              marginLeft: '0',
              marginRight: '0',
              paddingLeft: '0',
              paddingRight: '0',
            },
          }}
          wrapperClassName="w-full left-[30%] lg:left-[568px] w-full max-w-[70%] lg:max-w-[calc(100%-568px)]"
          className="flex items-center justify-center gap-x-36 w-full h-full opacity-[0.94]"
          backgroundColor={rightSectionBackgroundColor}
        >
          {children}
        </BaseContainer>
      </BaseContainer>
    </nav>
  );
};

import { ComponentType } from 'react';
import { ComponentProps, UniformSlotWrapperComponentProps } from '@uniformdev/canvas-react';

export type PageAdditionalProps = {
  headerCustomRenderer?: ComponentType<UniformSlotWrapperComponentProps>;
  contentCustomRenderer?: ComponentType<UniformSlotWrapperComponentProps>;
  footerCustomRenderer?: ComponentType<UniformSlotWrapperComponentProps>;
};

export type PageParameters = {
  pageTitle?: string;
  backgroundColor?: string;
};

export enum CommonPageSlots {
  PageContent = 'pageContent',
  PageHeader = 'pageHeader',
  PageFooter = 'pageFooter',
}

export type PageProps = ComponentProps<PageParameters> & PageAdditionalProps;

export { default } from './page';

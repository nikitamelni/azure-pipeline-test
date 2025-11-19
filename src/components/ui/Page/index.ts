import { HTMLAttributes, ReactNode } from 'react';

export type PageProps = HTMLAttributes<HTMLDivElement> & {
  header?: ReactNode;
  footer?: ReactNode;
  backgroundColor?: string;
};

export { Page as default } from './page';

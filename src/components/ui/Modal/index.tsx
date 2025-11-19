import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

export const MaxWidthMap = {
  small: 'max-w-xl',
  medium: 'max-w-2xl',
  large: 'max-w-4xl',
};

export type ModalProps = {
  maxWidth?: 'small' | 'medium' | 'large';
  className?: string;
  backgroundColor?: string;
  closeIconColor?: string;
  disableCloseModalOnClickOutside?: boolean;
  trigger: ReactNode;
  content: ReactNode;
  actions?: ReactNode;
  onChangeModalState?: (state: boolean) => void;
};

export default dynamic(() => import('./modal').then(mod => mod.Modal));

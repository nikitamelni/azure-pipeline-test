import { ComponentProps } from '@uniformdev/canvas-react';

export type DividerParameters = {
  color?: string;
  thickness?: '1px' | '2px' | '3px' | '4px' | '5px' | '6px' | '7px' | '8px' | '9px' | '10px';
  width?: '100%' | '90%' | '80%' | '70%' | '60%' | '50%' | '40%' | '30%' | '20%' | '10%';
  alignment?: 'start' | 'center' | 'end';
};

export type DividerProps = ComponentProps<DividerParameters>;

export { default } from './divider';

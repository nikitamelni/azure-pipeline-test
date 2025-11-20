import { FC } from 'react';
import { cn } from '@/utils/styling';
import BaseButton, { ButtonProps as CSKButtonProps } from '../canvas/Button';

type ButtonParameters = CSKButtonProps & {
  fullWidth?: boolean;
};

// This is an example of how you can override an existing CSK component based on the Container component.
const Button: FC<ButtonParameters> = props => (
  <BaseButton
    {...props}
    className={cn({
      'w-full text-center justify-center': props.fullWidth,
    })}
  />
);

export default Button;

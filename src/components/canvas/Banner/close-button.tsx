import { FC, MouseEventHandler, SVGProps } from 'react';
import { cn } from '@/utils/styling';

const CloseIcon: FC<SVGProps<SVGSVGElement>> = ({ className, ...restProps }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    className={cn('size-5', className)}
    {...restProps}
  >
    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
  </svg>
);

type CloseButtonProps = {
  onClose?: MouseEventHandler<HTMLButtonElement>;
  iconColor: string;
};
const CloseButton: FC<CloseButtonProps> = ({ onClose, iconColor }) => (
  <button
    onClick={onClose}
    className={cn('absolute right-5 top-1/2 -translate-y-1/2', { [`text-${iconColor}`]: iconColor })}
  >
    <CloseIcon />
  </button>
);

export default CloseButton;

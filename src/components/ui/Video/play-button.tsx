import { FC, SVGProps, HTMLAttributes } from 'react';
import { cn } from '@/utils/styling';

const PlayIcon: FC<SVGProps<SVGSVGElement>> = ({ className, ...restProps }) => (
  <svg
    className={cn('size-full', className)}
    viewBox="0 0 123 123"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <circle cx="61.5" cy="61.5" r="61.5" fillOpacity="0.922864" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M82.7064 62.0304L48.7754 81.6468V42.4141L82.7064 62.0304Z"
      stroke="white"
    />
  </svg>
);

export const PlayButton: FC<HTMLAttributes<HTMLButtonElement>> = ({ onClick }) => (
  <button
    className="absolute left-1/2 top-1/2 w-1/5 -translate-x-1/2 -translate-y-1/2 transition hover:scale-90"
    type="button"
    aria-label="Play video"
    onClick={onClick}
  >
    <PlayIcon />
  </button>
);

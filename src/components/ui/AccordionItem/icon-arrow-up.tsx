import { FC, SVGProps } from 'react';

export const IconArrowUp: FC<SVGProps<SVGSVGElement>> = ({ className, ...restProps }) => (
  <svg
    className={className}
    width="15"
    height="9"
    viewBox="0 0 15 9"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.49987 9L15 1.86349L13.0416 0L7.5 5.2729L1.95843 0L0 1.86349L7.49987 9Z"
      fill="currentColor"
    />
  </svg>
);

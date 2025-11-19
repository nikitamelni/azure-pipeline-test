import { FC, SVGProps } from 'react';

export const IconArrowDown: FC<SVGProps<SVGSVGElement>> = ({ className, ...restProps }) => (
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
      d="M7.50013 0L0 7.13651L1.95843 9L7.5 3.7271L13.0416 9L15 7.13651L7.50013 0Z"
      fill="currentColor"
    />
  </svg>
);

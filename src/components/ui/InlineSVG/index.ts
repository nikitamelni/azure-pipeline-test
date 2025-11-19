export type InlineSVGProps = {
  src: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sanitize?: boolean;
  fallback?: React.ReactNode;
  useCurrentColor?: boolean;
  alt?: string;
};

export { InlineSVG as default } from './inline-svg';

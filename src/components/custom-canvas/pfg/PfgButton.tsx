import { FC } from 'react';
import { LinkParamValue } from '@uniformdev/canvas';
import { ComponentProps, UniformText } from '@uniformdev/canvas-react';
import { formatUniformLink } from '@uniformdev/csk-components/utils/routing';
import { cn } from '@/utils/styling';

export type PfgButtonParameters = {
  displayName?: string;
  link?: LinkParamValue;
  buttonText?: string;
  size?: 'small' | 'large' | 'default';
};

type PfgButtonProps = ComponentProps<PfgButtonParameters>;

const PfgButton: FC<PfgButtonProps> = ({ link, size, component }) => {
  const href = formatUniformLink(link);
  const variant = component?.variant;

  const variantClasses =
    variant === 'buttonSecondary'
      ? 'bg-black text-white hover:bg-gray-800'
      : variant === 'buttonTertiary'
        ? 'bg-white text-black border border-black hover:bg-gray-100'
        : 'bg-red-700 text-white hover:bg-red-800';

  const sizeClasses = size === 'small' ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base';

  const classes = cn(
    'inline-flex items-center justify-center rounded font-semibold transition-colors',
    variantClasses,
    sizeClasses
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        <UniformText parameterId="buttonText" placeholder="Button" />
      </a>
    );
  }

  return (
    <button type="button" className={classes}>
      <UniformText parameterId="buttonText" placeholder="Button" />
    </button>
  );
};

export default PfgButton;

import { FC, useMemo } from 'react';
import { useRouter } from 'next/router';
import { UniformText, useUniformContextualEditingState } from '@uniformdev/canvas-react';
import BaseButton, { ButtonProps as BaseButtonProps } from '@/components/ui/Button';
import BaseImage from '@/components/ui/Image';
import { resolveAsset } from '@/utils/assets';
import { checkIsCurrentRoute, formatUniformLink } from '@/utils/routing';
import { ButtonProps } from '.';

const Button: FC<ButtonProps> = ({
  component,
  link,
  textColor,
  textFont,
  textWeight,
  textTransform,
  buttonColor,
  icon,
  iconPosition,
  border,
  size,
  textSize,
  hoverButtonColor,
  hoverTextColor,
  className,
  onClick,
  text,
}) => {
  const router = useRouter();
  const isCurrentRoute = useMemo(() => checkIsCurrentRoute(router, link), [router, link]);
  const { previewMode } = useUniformContextualEditingState();
  const isEditorPreviewMode = previewMode === 'editor';

  const href = formatUniformLink(link);

  const iconParameters = useMemo(() => {
    const [resolvedImage] = resolveAsset(icon);
    const { url, title = '' } = resolvedImage || {};
    if (!url) return undefined;

    return {
      url,
      title,
    };
  }, [icon]);

  const Icon = () => {
    if (!iconParameters) return undefined;

    const { url, title } = iconParameters;

    return (
      <BaseImage
        src={url}
        alt={title}
        width={20}
        height={20}
        containerStyle={{
          width: '20px',
          height: '20px',
        }}
      />
    );
  };

  const hasContent = !!text || !!iconParameters;

  if (!hasContent && !isEditorPreviewMode) return null;

  return (
    <BaseButton
      variant={component.variant as BaseButtonProps['variant']}
      href={href}
      border={border}
      size={size}
      onClick={onClick}
      className={className}
      textSize={textSize}
      isActive={isCurrentRoute}
      textColor={textColor}
      textFont={textFont}
      textWeight={textWeight}
      textTransform={textTransform}
      buttonColor={buttonColor}
      hoverButtonColor={hoverButtonColor}
      hoverTextColor={hoverTextColor}
      icon={<Icon />}
      iconPosition={iconPosition}
    >
      <UniformText placeholder="Button text goes here" parameterId="text" />
    </BaseButton>
  );
};

export default Button;

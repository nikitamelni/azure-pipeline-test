import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { flattenValues } from '@uniformdev/canvas';
import BaseHeader from '@/components/ui/Header';
import BaseIconLabel from '@/components/ui/IconLabel';
import { resolveAsset } from '@/utils/assets';
import { cn, resolveViewPort } from '@/utils/styling';
import { HeaderLink, SimpleHeaderProps, SimpleHeaderVariants } from '.';

const SimpleHeader: FC<SimpleHeaderProps> = ({
  logo,
  links,
  backgroundColor,
  textColor,
  hoverTextColor,
  component,
}) => {
  const variant = component.variant as SimpleHeaderVariants | undefined;
  const [resolvedLogo] = resolveAsset(logo);
  const resolvedLinks = (flattenValues(links) || []) as HeaderLink[];

  return (
    <BaseHeader
      sticky={variant === SimpleHeaderVariants.Sticky}
      leftSection={
        resolvedLogo?.url && (
          <Link href="/">
            <Image src={resolvedLogo?.url} alt="Logo" width={50} height={40} />
          </Link>
        )
      }
      backgroundColor={backgroundColor}
      color="general-color-1"
      spacing={{
        paddingTop: 'container-small',
        paddingBottom: 'container-small',
      }}
      border="none"
    >
      {resolvedLinks?.map(link => (
        <Link href={link.link?.path || ''} key={link.title}>
          <BaseIconLabel
            className="group"
            size="base"
            tag="span"
            color={textColor}
            weight="normal"
            font="sans"
            letterSpacing="normal"
            alignment="left"
          >
            <span
              className={cn({
                [resolveViewPort(hoverTextColor, 'group-hover:text-{value}')]: !!hoverTextColor,
              })}
            >
              {link.title}
            </span>
          </BaseIconLabel>
        </Link>
      ))}
    </BaseHeader>
  );
};

export default SimpleHeader;

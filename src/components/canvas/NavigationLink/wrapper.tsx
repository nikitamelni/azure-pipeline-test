import { FC, PropsWithChildren } from 'react';
import BaseLink from '@/components/ui/Link';

type WrapperProps = PropsWithChildren & {
  href: string;
  isExternalLink: boolean;
};

export const Wrapper: FC<WrapperProps> = ({ href, isExternalLink, children }) => {
  if (!href) {
    return <div className="cursor-pointer">{children}</div>;
  }

  return (
    <BaseLink
      className="cursor-pointer hover:no-underline"
      link={href}
      openInNewTab={isExternalLink}
      rel={isExternalLink ? 'noopener noreferrer' : ''}
    >
      {children}
    </BaseLink>
  );
};

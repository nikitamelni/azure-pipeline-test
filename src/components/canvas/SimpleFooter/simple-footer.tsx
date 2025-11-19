import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { flattenValues } from '@uniformdev/canvas';
import { UniformRichText, UniformText } from '@uniformdev/canvas-react';
import BaseFooter from '@/components/ui/Footer';
import { resolveAsset } from '@/utils/assets';
import { FooterLink, SimpleFooterProps } from '.';

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="30" viewBox="0 0 35 34" width="30">
    <path
      clipRule="evenodd"
      d="M17.5145 0C7.82942 0 0 7.79163 0 17.4309C0 25.1362 5.01658 31.6585 11.9759 33.9669C12.846 34.1405 13.1647 33.5919 13.1647 33.1304C13.1647 32.7263 13.136 31.3411 13.136 29.8979C8.26393 30.937 7.24936 27.82 7.24936 27.82C6.46638 25.7999 5.30626 25.2807 5.30626 25.2807C3.71162 24.2129 5.42241 24.2129 5.42241 24.2129C7.19128 24.3283 8.11946 26.0021 8.11946 26.0021C9.68505 28.6569 12.2079 27.9068 13.2228 27.445C13.3676 26.3194 13.8319 25.5403 14.3248 25.1075C10.439 24.7034 6.35059 23.2028 6.35059 16.5073C6.35059 14.6026 7.04609 13.0443 8.14814 11.8323C7.97426 11.3995 7.36516 9.60992 8.32237 7.2147C8.32237 7.2147 9.80121 6.75287 13.1357 9.00394C14.5633 8.62239 16.0356 8.42829 17.5145 8.42665C18.9933 8.42665 20.5008 8.62888 21.8929 9.00394C25.2277 6.75287 26.7066 7.2147 26.7066 7.2147C27.6638 9.60992 27.0543 11.3995 26.8805 11.8323C28.0116 13.0443 28.6784 14.6026 28.6784 16.5073C28.6784 23.2028 24.59 24.6743 20.6751 25.1075C21.3132 25.6557 21.8639 26.6945 21.8639 28.3396C21.8639 30.6771 21.8352 32.5531 21.8352 33.13C21.8352 33.5919 22.1543 34.1405 23.024 33.9673C29.9833 31.6581 34.9999 25.1362 34.9999 17.4309C35.0286 7.79163 27.1705 0 17.5145 0Z"
      fill="#1E1E1E"
      fillRule="evenodd"
    />
  </svg>
);

const StorybookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="30" viewBox="0 0 29 29" width="30">
    <path d="M29 0H0V29H29V0Z" fill="url(#pattern0_9543_564)" />
    <defs>
      <pattern height="1" id="pattern0_9543_564" patternContentUnits="objectBoundingBox" width="1">
        <use href="#image0_9543_564" transform="scale(0.005)" />
      </pattern>
      <image
        height="200"
        href="data:image/png;base64,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"
        id="image0_9543_564"
        width="200"
      />
    </defs>
  </svg>
);

export const Footer: FC<SimpleFooterProps> = ({ logo, links }) => {
  const [resolvedLogo] = resolveAsset(logo);
  const resolvedLinks = (flattenValues(links) || []) as FooterLink[];

  return (
    <BaseFooter
      logo={resolvedLogo?.url && <Image src={resolvedLogo?.url} alt="Logo" width={180} height={47} />}
      copyright={<UniformRichText parameterId="copyright" />}
      content={
        <div className="flex lg:gap-32 md:gap-16 gap-16">
          <div className="flex flex-col gap-2">
            <UniformText
              className="text-text-tertiary lg:text-base font-bold uppercase"
              parameterId="footerLinkSectionTitle"
            />
            {resolvedLinks?.map(link => (
              <Link
                className="text-text-primary font-bold transition-all duration-150 whitespace-nowrap"
                href={link.link?.path || ''}
                key={link.title}
              >
                {link.title}
              </Link>
            ))}
          </div>
          <div className="flex gap-4">
            <Link href="https://unfrm.to/csk-sb">
              <StorybookIcon />
            </Link>
            <Link href="https://unfrm.to/csk-repo">
              <GitHubIcon />
            </Link>
          </div>
        </div>
      }
      backgroundColor="general-color-1"
      spacing={{
        paddingTop: 'container-small',
        paddingBottom: 'container-small',
      }}
      border="border-footer"
      fluidContent={false}
    />
  );
};

export default Footer;

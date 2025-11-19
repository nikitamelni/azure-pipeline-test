import { FC } from 'react';
import { FixedHeroProps } from '.';
import { DemoHero } from './demo-hero';
import { getImageParametersFocalPoint } from './utils';

const FixedHero: FC<FixedHeroProps> = ({ textColor, overlayAutoTint, ...props }) => (
  <DemoHero
    {...props}
    // Eyebrow Text Parameters
    eyebrowTitleTag="span"
    eyebrowTitleSize={{
      mobile: 'xs',
      tablet: 'lg',
      desktop: 'xl',
    }}
    eyebrowTitleWeight="bold"
    eyebrowTitleTransform="uppercase"
    eyebrowTitleColor={textColor || props.eyebrowTitleColor}
    // Title Text Parameters
    titleSize={{
      mobile: '3xl',
      tablet: '4xl',
      desktop: '4xl',
    }}
    titleWeight="bold"
    titleColor={textColor || props.titleColor}
    // Description Text Parameters
    descriptionTag="p"
    descriptionSize={{
      mobile: 'sm',
      tablet: 'lg',
      desktop: 'xl',
    }}
    descriptionWeight="normal"
    descriptionColor={textColor || props.descriptionColor}
    // Primary Button Parameters
    primaryButtonSize="button-medium"
    primaryButtonTextSize="sm"
    primaryButtonTextWeight="normal"
    primaryButtonButtonColor="button-primary"
    primaryButtonTextTransform="uppercase"
    primaryButtonHoverButtonColor="button-primary-hover"
    // Image Parameters
    imagePriority
    imageObjectFit="cover"
    imageUnoptimized
    imageContrastBaseColor={!props.component.variant && overlayAutoTint ? textColor : undefined}
    imageOverlayOpacity={overlayAutoTint}
    {...getImageParametersFocalPoint(!!props.component.variant)}
    // Presentation Parameters
    spacing={{
      paddingTop: 'container-xlarge',
      paddingLeft: 'container-small',
      paddingRight: 'container-small',
      paddingBottom: 'container-xlarge',
    }}
    fluidContent={!props.component.variant}
  />
);

export default FixedHero;

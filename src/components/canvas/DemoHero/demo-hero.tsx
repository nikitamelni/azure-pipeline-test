import { FC } from 'react';
import { UniformSlot, useUniformContextualEditingState } from '@uniformdev/canvas-react';
import { DemoHeroVariants, FixedHeroProps, FlexibleHeroProps, FlexibleHeroSlots } from '.';
import { BaseHeroButton, BaseHeroImage, BaseHeroText } from './atoms';
import { ColumnsVariant } from './columns-variant';
import { DefaultVariant } from './default-variant';
import { getButtonAlignmentClass, getTextAlignmentClass } from './style-utils';
import { cleanUpPrefix } from './utils';

type FixedHeroComponentProps = {
  isFlexibleHero?: false;
} & FixedHeroProps;

type FlexibleHeroComponentProps = {
  isFlexibleHero: true;
} & FlexibleHeroProps;

export const DemoHero: FC<FixedHeroComponentProps | FlexibleHeroComponentProps> = ({
  // Eyebrow Text Parameters
  eyebrowTitleText,
  eyebrowTitleTag,
  eyebrowTitleSize,
  eyebrowTitleColor,
  eyebrowTitleWeight,
  eyebrowTitleFont,
  eyebrowTitleAlignment,
  eyebrowTitleTransform,
  eyebrowTitleDecoration,
  eyebrowTitleLetterSpacing,
  eyebrowTitleLineCountRestrictions,
  // Title Text Parameters
  titleText,
  titleTag,
  titleSize,
  titleColor,
  titleWeight,
  titleFont,
  titleAlignment,
  titleTransform,
  titleDecoration,
  titleLetterSpacing,
  titleLineCountRestrictions,
  // Description Text Parameters
  descriptionText,
  descriptionTag,
  descriptionSize,
  descriptionColor,
  descriptionWeight,
  descriptionFont,
  descriptionAlignment,
  descriptionTransform,
  descriptionDecoration,
  descriptionLetterSpacing,
  descriptionLineCountRestrictions,
  // Primary Button Parameters
  primaryButtonVariant,
  primaryButtonText,
  primaryButtonLink,
  primaryButtonTextColor,
  primaryButtonTextWeight,
  primaryButtonTextFont,
  primaryButtonTextTransform,
  primaryButtonButtonColor,
  primaryButtonBorder,
  primaryButtonSize,
  primaryButtonIcon,
  primaryButtonTextSize,
  primaryButtonIconPosition,
  primaryButtonHoverButtonColor,
  primaryButtonHoverTextColor,
  // Image Parameters
  image,
  imageWidth,
  imageHeight,
  imageObjectFit,
  imageOverlayColor,
  imageContrastBaseColor,
  imageOverlayOpacity,
  imageBorder,
  imagePriority,
  imageUnoptimized,
  imageFill,
  // Presentation Parameters
  contentAlignment,
  backgroundColor,
  spacing,
  border,
  fluidContent,
  height,
  isFlexibleHero,
  component,
}) => {
  const { previewMode } = useUniformContextualEditingState();
  const isEditorPreviewMode = previewMode === 'editor';

  const variant = component.variant as DemoHeroVariants | undefined;

  const demoHeroContent = isFlexibleHero ? (
    <UniformSlot name={FlexibleHeroSlots.FlexibleHeroContent} emptyPlaceholder={<div className="h-20" />} />
  ) : (
    <>
      <BaseHeroText
        {...cleanUpPrefix(
          {
            eyebrowTitleText,
            eyebrowTitleTag,
            eyebrowTitleSize,
            eyebrowTitleColor,
            eyebrowTitleWeight,
            eyebrowTitleFont,
            eyebrowTitleAlignment,
            eyebrowTitleTransform,
            eyebrowTitleDecoration,
            eyebrowTitleLetterSpacing,
            eyebrowTitleLineCountRestrictions,
          },
          'eyebrowTitle'
        )}
        isEditorPreviewMode={isEditorPreviewMode}
        component={component}
        parameterId="eyebrowTitleText"
      />
      <BaseHeroText
        {...cleanUpPrefix(
          {
            titleText,
            titleTag,
            titleSize,
            titleColor,
            titleWeight,
            titleFont,
            titleAlignment,
            titleTransform,
            titleDecoration,
            titleLetterSpacing,
            titleLineCountRestrictions,
          },
          'title'
        )}
        isEditorPreviewMode={isEditorPreviewMode}
        component={component}
        parameterId="titleText"
      />
      <BaseHeroText
        {...cleanUpPrefix(
          {
            descriptionText,
            descriptionTag,
            descriptionSize,
            descriptionColor,
            descriptionWeight,
            descriptionFont,
            descriptionAlignment,
            descriptionTransform,
            descriptionDecoration,
            descriptionLetterSpacing,
            descriptionLineCountRestrictions,
          },
          'description'
        )}
        isEditorPreviewMode={isEditorPreviewMode}
        component={component}
        parameterId="descriptionText"
      />
    </>
  );

  const demoHeroCTA = isFlexibleHero ? (
    <UniformSlot name={FlexibleHeroSlots.FlexibleHeroCta} emptyPlaceholder={<div className="mx-40 h-20 w-full" />} />
  ) : (
    <>
      <BaseHeroButton
        {...cleanUpPrefix(
          {
            primaryButtonVariant,
            primaryButtonText,
            primaryButtonLink,
            primaryButtonTextColor,
            primaryButtonTextWeight,
            primaryButtonTextFont,
            primaryButtonTextTransform,
            primaryButtonButtonColor,
            primaryButtonBorder,
            primaryButtonSize,
            primaryButtonIcon,
            primaryButtonTextSize,
            primaryButtonIconPosition,
            primaryButtonHoverButtonColor,
            primaryButtonHoverTextColor,
          },
          'primaryButton'
        )}
        isEditorPreviewMode={isEditorPreviewMode}
        component={component}
        parameterId="primaryButtonText"
      />
    </>
  );

  const variantProps = {
    backgroundColor,
    spacing,
    border,
    fluidContent,
    height,
    textAlignmentClass: getTextAlignmentClass({ contentAlignment }),
    buttonAlignmentClass: getButtonAlignmentClass({ contentAlignment }),
    demoHeroMedia: (
      <>
        <BaseHeroImage
          image={image}
          {...cleanUpPrefix(
            {
              imageWidth,
              imageHeight,
              imageObjectFit,
              imageOverlayColor,
              imageContrastBaseColor,
              imageOverlayOpacity,
              imageBorder,
              imagePriority,
              imageUnoptimized,
              imageFill,
            },
            'image'
          )}
          component={component}
          isEditorPreviewMode={isEditorPreviewMode}
        />
      </>
    ),
    demoHeroContent: demoHeroContent,
    demoHeroCTA: demoHeroCTA,
  };

  switch (variant) {
    case DemoHeroVariants.Columns:
    case DemoHeroVariants.ColumnsReverse:
      return <ColumnsVariant variant={variant} {...variantProps} />;
    default:
      return <DefaultVariant {...variantProps} />;
  }
};

import { FC, useMemo } from 'react';
import { LinkParamValue, flattenValues } from '@uniformdev/canvas';
import { useUniformContextualEditingState, useUniformCurrentComposition } from '@uniformdev/canvas-react';
import BaseButton, { ButtonVariant } from '@/components/ui/Button';
import BaseText from '@/components/ui/Text';
import { formatUniformLink } from '@/utils/routing';
import { cn } from '@/utils/styling';
import { BreadcrumbLink, BreadcrumbsProps, useBreadcrumbsContext } from '.';
import { getSeparator } from './helpers';

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ separator, links, size, color, font, transform, autoGenerate }) => {
  // Matched route is 'composition' — this means we're in the composition pattern,
  // so we don't have access to the project map at this point.
  const { data } = useUniformCurrentComposition();
  const { previewMode } = useUniformContextualEditingState();
  const isEditorPreviewMode = previewMode === 'editor' || previewMode === 'preview';
  const isInPattern = !data?.type || data?.type !== 'page';
  const { breadcrumbs = [] } = useBreadcrumbsContext() || {};

  const getManualBreadcrumbs = useMemo(
    (): BreadcrumbLink[] =>
      ((flattenValues(links) || []) as { title?: string; link?: LinkParamValue }[])
        ?.filter(Boolean)
        .reduce<BreadcrumbLink[]>((acc, { title, link }) => {
          if (!title) return acc;

          return [...acc, { title, link: formatUniformLink(link) }];
        }, []) || [],
    [links]
  );

  const itemToDisplay = autoGenerate ? breadcrumbs : getManualBreadcrumbs;

  if (isInPattern && autoGenerate) {
    return (
      <ul className="flex items-center">
        <li className="flex items-center">
          <BaseText size={size} font={font} color={color} transform={transform}>
            Breadcrumbs cannot be auto-generated because the project map is not accessible in this context.
          </BaseText>
        </li>
      </ul>
    );
  }

  if (isEditorPreviewMode && autoGenerate) {
    return (
      <ul className="flex items-center">
        <li className="flex items-center">
          <BaseText size={size} font={font} color={color} transform={transform}>
            Auto-generated breadcrumbs is hidden in contextual editing and preview mode.
          </BaseText>
        </li>
      </ul>
    );
  }

  if (!itemToDisplay.length) {
    // ToDo: Add breadcrumbs placeholder
    return null;
  }

  return (
    <ul
      className={cn('flex items-center', {
        [`text-${size}`]: !!size,
        [`text-${color}`]: !!color,
      })}
    >
      {itemToDisplay.map(({ title, link }, index) => (
        <li className="flex items-center" key={`${title}-${index}`}>
          {!!index && <div className="mx-2 size-[1em]">{getSeparator(separator)}</div>}
          {!link ? (
            <BaseText size={size} font={font} color={color} transform={transform}>
              {title}
            </BaseText>
          ) : (
            <BaseButton
              variant={ButtonVariant.Link}
              textColor={color}
              className={cn({
                [`font-${font}`]: !!font,
                [`text-${size}`]: !!size,
                [transform || '']: !!transform,
              })}
              href={link}
            >
              {title}
            </BaseButton>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Breadcrumbs;

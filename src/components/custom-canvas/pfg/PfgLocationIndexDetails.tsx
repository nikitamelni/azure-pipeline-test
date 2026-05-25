import { FC } from 'react';
import { AssetParamValue } from '@uniformdev/assets';
import { LinkParamValue, RichTextParamValue } from '@uniformdev/canvas';
import { ComponentProps } from '@uniformdev/canvas-react';
import { resolveAsset } from '@uniformdev/csk-components/utils/assets';
import { formatUniformLink } from '@uniformdev/csk-components/utils/routing';

const extractPlainText = (richText?: RichTextParamValue): string => {
  if (!richText || typeof richText !== 'object') return '';
  try {
    return JSON.stringify(richText)
      .replace(/[{}[\]":,]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 500);
  } catch {
    return '';
  }
};

export type PfgLocationIndexDetailsParameters = {
  displayName?: string;
  title?: string;
  name?: string;
  locationSlug?: string;
  opcoid?: string;
  description?: RichTextParamValue;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  phoneNumber?: string;
  faxNumber?: string;
  mapImage?: AssetParamValue;
  mapLink?: LinkParamValue;
};

type PfgLocationIndexDetailsProps = ComponentProps<PfgLocationIndexDetailsParameters>;

const PfgLocationIndexDetails: FC<PfgLocationIndexDetailsProps> = ({
  title,
  name,
  locationSlug,
  opcoid,
  description,
  address1,
  address2,
  city,
  state,
  zip,
  phoneNumber,
  faxNumber,
  mapImage,
  mapLink,
}) => {
  const [resolvedMap] = resolveAsset(mapImage);
  const mapHref = formatUniformLink(mapLink);
  const plainDescription = extractPlainText(description);

  return (
    <div
      hidden
      aria-hidden
      data-index-component="location"
      data-index-prop-location-title={title || ''}
      data-index-prop-location-name={name || ''}
      data-index-prop-location-slug={locationSlug || ''}
      data-index-prop-location-opcoid={opcoid || ''}
      data-index-prop-location-description={plainDescription}
      data-index-prop-location-address1={address1 || ''}
      data-index-prop-location-address2={address2 || ''}
      data-index-prop-location-city={city || ''}
      data-index-prop-location-state-abbr={state || ''}
      data-index-prop-location-zip={zip || ''}
      data-index-prop-location-phone-number={phoneNumber || ''}
      data-index-prop-location-fax-number={faxNumber || ''}
      data-index-prop-location-map-image={resolvedMap?.url || ''}
      data-index-prop-location-map-link={mapHref || ''}
    />
  );
};

export default PfgLocationIndexDetails;

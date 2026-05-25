import { FC } from 'react';
import Image from 'next/image';
import { AssetParamValue } from '@uniformdev/assets';
import { LinkParamValue } from '@uniformdev/canvas';
import { ComponentProps, UniformText } from '@uniformdev/canvas-react';
import { resolveAsset } from '@uniformdev/csk-components/utils/assets';
import { formatUniformLink } from '@uniformdev/csk-components/utils/routing';

export type PfgLocationDetailsParameters = {
  displayName?: string;
  mapImage?: AssetParamValue;
  locationName?: string;
  locationAddress?: string;
  locationAddress2?: string;
  locationCity?: string;
  locationState?: string;
  locationZip?: string;
  locationDirectionsLink?: LinkParamValue;
  locationPhone?: string;
  locationTollFree?: string;
  locationFax?: string;
  willCallAddress?: string;
  willCallAddress2?: string;
  willCallCity?: string;
  willCallState?: string;
  willCallZip?: string;
  willCallDirectionsLink?: LinkParamValue;
};

type PfgLocationDetailsProps = ComponentProps<PfgLocationDetailsParameters>;

const PfgLocationDetails: FC<PfgLocationDetailsProps> = ({
  mapImage,
  locationPhone,
  locationTollFree,
  locationFax,
  locationDirectionsLink,
  willCallDirectionsLink,
}) => {
  const [resolvedMap] = resolveAsset(mapImage);
  const locationDirectionsHref = formatUniformLink(locationDirectionsLink);
  const willCallDirectionsHref = formatUniformLink(willCallDirectionsLink);

  return (
    <section className="w-full px-6 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
        <div>
          {resolvedMap?.url && (
            <Image
              src={resolvedMap.url}
              alt="Map"
              width={resolvedMap.width || 600}
              height={resolvedMap.height || 400}
              className="h-auto w-full rounded object-cover"
            />
          )}
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <UniformText
              parameterId="locationName"
              as="h2"
              className="text-2xl font-bold"
              placeholder="Location name"
            />
            <address className="not-italic">
              <UniformText parameterId="locationAddress" as="div" placeholder="Address" />
              <UniformText parameterId="locationAddress2" as="div" placeholder="" />
              <div>
                <UniformText parameterId="locationCity" as="span" placeholder="City" />
                {', '}
                <UniformText parameterId="locationState" as="span" placeholder="State" />{' '}
                <UniformText parameterId="locationZip" as="span" placeholder="ZIP" />
              </div>
            </address>
            {locationDirectionsHref && (
              <a href={locationDirectionsHref} className="text-red-700 underline hover:text-red-900">
                Get directions
              </a>
            )}
            {locationPhone && (
              <a href={`tel:${locationPhone}`} className="text-base">
                Phone: {locationPhone}
              </a>
            )}
            {locationTollFree && (
              <a href={`tel:${locationTollFree}`} className="text-base">
                Toll-free: {locationTollFree}
              </a>
            )}
            {locationFax && <div className="text-base">Fax: {locationFax}</div>}
          </div>

          <div className="flex flex-col gap-2 border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold">Will-Call Pickup</h3>
            <address className="not-italic">
              <UniformText parameterId="willCallAddress" as="div" placeholder="Will-call address" />
              <UniformText parameterId="willCallAddress2" as="div" placeholder="" />
              <div>
                <UniformText parameterId="willCallCity" as="span" placeholder="City" />
                {', '}
                <UniformText parameterId="willCallState" as="span" placeholder="State" />{' '}
                <UniformText parameterId="willCallZip" as="span" placeholder="ZIP" />
              </div>
            </address>
            {willCallDirectionsHref && (
              <a href={willCallDirectionsHref} className="text-red-700 underline hover:text-red-900">
                Get directions
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PfgLocationDetails;

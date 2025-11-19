import { AssetParamValue, AssetParamValueItem } from '@uniformdev/assets';
import { flattenValues } from '@uniformdev/canvas';
import { ResolvedAssetFromItem } from '@/types/cskTypes';

/**
 * Resolves a list of assets, filtering out any entries without a valid URL.
 *
 * @param {AssetParamValue | undefined} image - The list of assets to resolve.
 * @returns {ResolvedAsset[]} - An array of resolved assets with valid URLs.
 */
export const resolveAsset = (image?: AssetParamValue): ResolvedAssetFromItem<AssetParamValueItem>[] =>
  (flattenValues(image as never) || []).filter(({ url }) => Boolean(url));

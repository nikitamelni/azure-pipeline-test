import { HTMLAttributes } from 'react';
import { AssetParamValueItem } from '@uniformdev/canvas';

export type ResolveEmptyPlaceholderOptions = {
  slotName: string;
  slotIndex: number;
};

export type ViewPort<T> = {
  desktop?: T;
  tablet?: T;
  mobile?: T;
};

export type SpaceType = Pick<
  NonNullable<HTMLAttributes<HTMLDivElement>['style']>,
  | 'marginTop'
  | 'marginLeft'
  | 'paddingTop'
  | 'marginRight'
  | 'paddingLeft'
  | 'marginBottom'
  | 'paddingRight'
  | 'paddingBottom'
>;

type ValueOfField<F> = F extends { value: infer V } ? V : never;
type FlattenFields<T extends AssetParamValueItem> = {
  [K in keyof T['fields']]: ValueOfField<T['fields'][K]>;
};
type RenameKey<T, K extends keyof T, NewName extends PropertyKey> = Omit<T, K> & { [P in NewName]: T[K] };

export type ResolvedAssetFromItem<T extends AssetParamValueItem> = RenameKey<FlattenFields<T>, 'id', 'file'> & {
  id: T['_id'];
};

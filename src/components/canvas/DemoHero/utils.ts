export type PrefixedKeys<T, Prefix extends string> = {
  [Key in keyof T as `${Prefix}${Capitalize<string & Key>}`]: T[Key];
};

export type RemovePrefix<T, Prefix extends string> = {
  [Key in keyof T as Key extends `${Prefix}${infer Rest}` ? Uncapitalize<Rest> : Key]: T[Key];
};

export const cleanUpPrefix = <T extends Record<string, unknown>, Prefix extends string>(
  obj: T,
  prefix: Prefix
): RemovePrefix<T, Prefix> => {
  return Object.entries(obj).reduce(
    (result, [key, value]) => {
      if (key.startsWith(prefix)) {
        const cleanedKey = (key.slice(prefix.length) as string).replace(/^./, char =>
          char.toLowerCase()
        ) as keyof RemovePrefix<T, Prefix>;
        return {
          ...result,
          [cleanedKey]: value as T[keyof T],
        };
      }
      return {
        ...result,
        [key]: value as T[keyof T],
      };
    },
    {} as RemovePrefix<T, Prefix>
  );
};

const HALF_DISPLAY_WIDTH = 608;
export const getImageParametersFocalPoint = (isVariant: boolean) => {
  const columnImageDimensions = isVariant ? HALF_DISPLAY_WIDTH : undefined;
  return {
    imageFill: !isVariant,
    ...(columnImageDimensions
      ? {
          imageWidth: columnImageDimensions,
          imageHeight: columnImageDimensions,
        }
      : {}),
  };
};

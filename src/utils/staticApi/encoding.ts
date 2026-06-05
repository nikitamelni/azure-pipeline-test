// Browser-safe base64url encoding. Matches what the Azure mirror Function
// computes when it writes the blob (`Buffer.from(path).toString('base64url')`),
// so the URL the fetch override constructs is identical to the stored key.

const stripPadding = (b64: string): string =>
  b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export const base64urlEncode = (input: string): string => {
  if (typeof Buffer !== 'undefined') {
    // Node / SSR path — Buffer supports 'base64url' natively.
    return Buffer.from(input, 'utf8').toString('base64url');
  }
  // Browser path — encode UTF-8 bytes, then base64, then URL-safe-ify.
  const utf8 = new TextEncoder().encode(input);
  let binary = '';
  for (let i = 0; i < utf8.length; i++) binary += String.fromCharCode(utf8[i]);
  return stripPadding(btoa(binary));
};

import Head from 'next/head';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { AssetParamValue } from '@uniformdev/assets';
import { flattenValues, type RootComponentInstance } from '@uniformdev/canvas';
import { UniformAppProps } from '@uniformdev/context-next';
import { UniformContext } from '@uniformdev/context-react';
import '@/styles/globals.css';
import '@/styles/colors.css';
import '@/styles/dimensions.css';
import '@/styles/fonts.css';
import '@/styles/borders.css';
import '@/styles/custom_fonts.css';
import { resolveAsset } from '@uniformdev/csk-components/utils/assets';
import { customFontVariables } from '@/fonts';
import createUniformContext from '@/utils/canvas/createUniformContext';

type UniformMetadataParameters = {
  pageTitle: string;
  pageDescription: string;
  pageKeywords: string;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphType:
    | 'website'
    | 'article'
    | 'book'
    | 'profile'
    | 'music.song'
    | 'music.album'
    | 'music.playlist'
    | 'music.radio_station'
    | 'video.movie'
    | 'video.episode'
    | 'video.tv_show'
    | 'video.other';
  openGraphImage: AssetParamValue;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: AssetParamValue;
  twitterCard: 'summary' | 'summary_large_image' | 'app' | 'player';
  favicon: AssetParamValue;
};

const getManifestFromDOM = () => {
  if (typeof window === 'undefined') {
    return { project: {} };
  }
  const json = document.getElementById('manifest')?.innerHTML;
  return json ? JSON.parse(json) : { project: {} };
};

const App = ({ Component, pageProps, serverUniformContext }: UniformAppProps<{ data: RootComponentInstance }>) => {
  const manifest = getManifestFromDOM();
  const clientContext = createUniformContext(manifest);

  const { data: composition } = pageProps || {};

  // Flatten the composition parameters for easier access
  const parameters = flattenValues(composition, { levels: 0 }) as UniformMetadataParameters;

  // Destructure metadata parameters from the composition
  const {
    pageTitle = 'Uniform Component Starter Kit (Pages Router)',
    pageDescription,
    pageKeywords,
    openGraphTitle,
    openGraphDescription,
    openGraphImage,
    openGraphType,
    twitterTitle,
    twitterDescription,
    twitterImage,
    twitterCard,
    favicon,
  } = parameters || {};

  // Resolve assets for Open Graph, Twitter, and favicon
  const [resolvedOgImage] = resolveAsset(openGraphImage);
  const [resolvedTwitterImage] = resolveAsset(twitterImage);
  const [resolvedFavicon] = resolveAsset(favicon);

  const renderOgImageElement = () => {
    if (resolvedOgImage?.url) return <meta property="og:image" content={resolvedOgImage.url} />;
  };

  const renderTwitterImageElement = () => {
    if (resolvedTwitterImage?.url) return <meta property="twitter:image" content={resolvedTwitterImage.url} />;
  };

  return (
    <>
      <Head>
        {/* page metadata */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        {/* Open Graph */}
        <meta property="og:title" content={openGraphTitle || pageTitle} />
        <meta property="og:description" content={openGraphDescription || pageDescription} />
        <meta property="og:type" content={openGraphType} />
        {renderOgImageElement()}
        {/* Twitter */}
        <meta name="twitter:title" content={twitterTitle || pageTitle} />
        <meta name="twitter:description" content={twitterDescription || pageDescription} />
        <meta name="twitter:card" content={twitterCard} />
        {renderTwitterImageElement()}
        {/* Other stuff */}
        <meta name="version" content={process.env.NEXT_PUBLIC_APP_VERSION} />
        {resolvedFavicon?.url && <link rel="shortcut icon" href={resolvedFavicon.url} />}
      </Head>
      <NextThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <UniformContext context={serverUniformContext ?? clientContext} outputType="standard">
          <div className={customFontVariables}>
            <Component {...pageProps} />
          </div>
        </UniformContext>
      </NextThemeProvider>
    </>
  );
};

export default App;

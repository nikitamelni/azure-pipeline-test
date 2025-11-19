import { ReactElement } from 'react';
import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from 'next/document';
import { ManifestV2 } from '@uniformdev/context';
import { ManifestClient } from '@uniformdev/context/api';
import { enableNextSsr } from '@uniformdev/context-next';
import createUniformContext from '@/utils/canvas/createUniformContext';

type CustomDocumentProps = DocumentInitialProps & { manifest: ManifestV2 };

const getManifestClient = () => {
  const apiKey = process.env.UNIFORM_API_KEY;
  const apiHost = process.env.UNIFORM_CLI_BASE_URL || 'https://uniform.app';
  const projectId = process.env.UNIFORM_PROJECT_ID;

  if (!apiKey) throw new Error('apiKey is not specified. ManifestClient cannot be instantiated');
  if (!apiHost) throw new Error('apiHost is not specified. ManifestClient cannot be instantiated');
  if (!projectId) throw new Error('projectId is not specified. ManifestClient cannot be instantiated.');

  return new ManifestClient({
    apiKey,
    apiHost,
    projectId,
  });
};

async function getManifest() {
  return getManifestClient().get();
}

class AppDocument extends Document<CustomDocumentProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<CustomDocumentProps> {
    const manifest = await getManifest();
    const serverTracker = createUniformContext(manifest, ctx);
    enableNextSsr(ctx, serverTracker);
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps, manifest };
  }

  render(): ReactElement {
    return (
      <Html lang="en">
        <Head>
          <script
            id="manifest"
            type="application/json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(this.props.manifest) }}
          />
        </Head>
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default AppDocument;

import { FC } from 'react';
import Head from 'next/head';
import { ComponentProps } from '@uniformdev/canvas-react';

export type SchemaMarkupParameters = {
  displayName?: string;
  schemaMarkup?: string;
};

type SchemaMarkupProps = ComponentProps<SchemaMarkupParameters>;

const SchemaMarkup: FC<SchemaMarkupProps> = ({ schemaMarkup }) => {
  if (!schemaMarkup) return null;

  const trimmed = schemaMarkup.trim();
  const isScriptWrapped = trimmed.startsWith('<script');
  const jsonContent = isScriptWrapped ? trimmed.replace(/<script[^>]*>|<\/script>/g, '').trim() : trimmed;

  return (
    <Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonContent }} />
    </Head>
  );
};

export default SchemaMarkup;

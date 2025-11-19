import { NextApiRequest, NextApiResponse } from 'next';
import { createPreviewHandler } from '@uniformdev/canvas-next';

const previewHandler = createPreviewHandler({
  secret: () => process.env.UNIFORM_PREVIEW_SECRET || 'hello-world',
  playgroundPath: '/playground',
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await previewHandler(req, res);
};

export default handler;

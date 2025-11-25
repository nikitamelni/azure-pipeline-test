import { ContentClient } from '@uniformdev/canvas';

export const getContentClient = () => {
  if (!process.env.UNIFORM_API_KEY) throw new Error('UNIFORM_API_KEY is not set');
  if (!process.env.UNIFORM_PROJECT_ID) throw new Error('UNIFORM_PROJECT_ID is not set');

  return new ContentClient({
    apiKey: process.env.UNIFORM_API_KEY,
    projectId: process.env.UNIFORM_PROJECT_ID,
  });
};

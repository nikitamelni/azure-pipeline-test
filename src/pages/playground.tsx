import { FC } from 'react';
import { createUniformApiEnhancer, UniformPlayground } from '@uniformdev/canvas-react';
import { componentResolver } from '@/components';

const Playground: FC = () => {
  const contextualEditingEnhancer = createUniformApiEnhancer({ apiUrl: '/api/preview' });

  return (
    <UniformPlayground
      contextualEditingEnhancer={contextualEditingEnhancer}
      behaviorTracking="onLoad"
      resolveRenderer={componentResolver}
    />
  );
};

export default Playground;

import { FC } from 'react';
import { useUniformContextualEditingState } from '@uniformdev/canvas-react';
import MediaPlaceholder from '@/components/ui/MediaPlaceholder';
import { VideoProps } from '.';

type VideoPlaceholderProps = Pick<VideoProps, 'component'>;

export const VideoPlaceholder: FC<VideoPlaceholderProps> = ({ component }) => {
  const { previewMode } = useUniformContextualEditingState();
  const isEditorPreviewMode = previewMode === 'editor';
  const isPlaceholder = component?._id?.includes('placeholder_');

  if (!isEditorPreviewMode || isPlaceholder) {
    return null;
  }

  return <MediaPlaceholder type="video" placeholder="Please add video link to display a video" />;
};

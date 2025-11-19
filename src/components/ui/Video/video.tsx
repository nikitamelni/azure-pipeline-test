import { FC, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { cn, resolveViewPort } from '@/utils/styling';
import { VideoProps } from '.';
import { PlayButton } from './play-button';

const ReactPlayer = dynamic(() => import('react-player/lazy').then(mod => mod.default), { ssr: false });

export const Video: FC<VideoProps> = ({
  url,
  autoPlay = false,
  loop,
  controls,
  lazyLoad = false,
  placeholderImageUrl,
  muted,
  overlayColor,
  overlayOpacity,
  border,
}) => {
  const [playing, setPlaying] = useState(autoPlay);

  const onPlay = useCallback(() => setPlaying(true), []);
  const onPause = useCallback(() => setPlaying(false), []);

  return (
    <div className="relative aspect-video size-full [&_video]:!object-cover">
      {url && (
        <div
          className={cn('absolute left-0 top-0 size-full overflow-hidden', {
            [resolveViewPort(border, '{value}')]: border,
          })}
        >
          <ReactPlayer
            url={url}
            playing={playing}
            onPause={onPause}
            onPlay={onPlay}
            width="100%"
            height="100%"
            controls={controls}
            muted={muted}
            loop={loop}
            light={(lazyLoad && placeholderImageUrl) || lazyLoad}
            playIcon={<PlayButton onClick={onPlay} />}
          />
        </div>
      )}
      <div
        className={cn('absolute inset-0 pointer-events-none', {
          [`bg-${overlayColor}`]: overlayColor,
          [resolveViewPort(border, '{value}')]: border,
        })}
        style={{ opacity: overlayOpacity || 0 }}
      />
    </div>
  );
};

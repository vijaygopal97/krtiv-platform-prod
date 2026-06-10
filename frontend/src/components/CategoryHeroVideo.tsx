'use client';

import VideoPlayer from '@/components/VideoPlayer';
import CategoryVideoWithEngagement, {
  type CategoryPageVideo,
} from '@/components/CategoryVideoWithEngagement';

const MAHARASHTRA_TOURISM_INSTAGRAM =
  'https://www.instagram.com/maharashtratourismofficial?igsh=anhlNHpkNGd1aTJv';

export type CategoryHeroVideoProps =
  | { kind: 'signpost'; video: CategoryPageVideo; defaultThumbnail: string }
  | { kind: 'url'; url: string; title: string; defaultThumbnail: string };

export function CategoryHeroVideo(props: CategoryHeroVideoProps) {
  if (props.kind === 'signpost') {
    return (
      <CategoryVideoWithEngagement
        video={props.video}
        defaultThumbnail={props.defaultThumbnail}
        embedded
      />
    );
  }

  return (
    <div className="w-full h-full">
      <VideoPlayer
        src={props.url}
        defaultThumbnail={props.defaultThumbnail}
        title={props.title}
        subtitle="Click to watch"
        lightbox
        heroEmbedded
        generatePosterFromVideo
        instagramUrl={MAHARASHTRA_TOURISM_INSTAGRAM}
      />
    </div>
  );
}

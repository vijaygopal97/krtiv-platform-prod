'use client';

import VideoPlayer from '@/components/VideoPlayer';
import { heroVideoConfig } from '@/config/video';

const MAHARASHTRA_TOURISM_INSTAGRAM =
  'https://www.instagram.com/maharashtratourismofficial?igsh=anhlNHpkNGd1aTJv';

/** Home hero SignPost-style player slot for redesigned HeroSection. */
export function HomeHeroVideo() {
  return (
    <div className="w-full h-full [&_.video-player-root]:h-full">
      <VideoPlayer
        src={heroVideoConfig.src}
        thumbnailUrl={heroVideoConfig.thumbnailUrl}
        defaultThumbnail={heroVideoConfig.defaultThumbnail}
        title={heroVideoConfig.title}
        subtitle={heroVideoConfig.subtitle}
        lightbox
        heroEmbedded
        instagramUrl={MAHARASHTRA_TOURISM_INSTAGRAM}
      />
    </div>
  );
}

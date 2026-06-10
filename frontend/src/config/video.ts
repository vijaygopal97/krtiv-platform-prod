/**
 * Video configuration for the app.
 * Supports custom thumbnail URLs - if provided, that URL is used.
 * Otherwise, a default/auto-generated thumbnail is used.
 * For streaming: use MP4 with faststart for efficient byte-range streaming.
 */

import { assetPath } from '@/lib/basePath';

export const heroVideoConfig = {
  /**
   * Video source - local path (in public/videos/) or external URL.
   * Place your video at: frontend/public/videos/hero-video.mp4
   */
  src: assetPath('/videos/hero-video.mp4'),
  thumbnailUrl: assetPath('/videos/hero-thumbnail.jpg'),
  defaultThumbnail: assetPath('/hero-image.jpeg'),

  title: 'Watch The Journey Through Maharashtra',
  subtitle: 'Click to experience the adventure',
} as const;

export type VideoConfig = {
  src: string;
  thumbnailUrl?: string;
  defaultThumbnail: string;
  title: string;
  subtitle: string;
};

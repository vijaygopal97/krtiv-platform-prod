'use client';

import type { SnapshotStory } from '@/types/snapshotStory';

type Props = {
  story: SnapshotStory;
  index: number;
  onOpen: () => void;
};

export function SnapshotStoryCard({ story, index, onOpen }: Props) {
  const count = story.galleryImages.length;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="snapshot-card group w-full text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--saffron)] focus-visible:ring-offset-2"
    >
      <div className="snapshot-card-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={story.coverImage}
          alt={story.galleryImages[0]?.alt ?? story.title}
          loading={index < 4 ? 'eager' : 'lazy'}
          decoding="async"
          className="snapshot-card-image"
        />
        <div className="snapshot-card-gradient" />
        <span className="snapshot-card-badge">{story.category}</span>
        <div className="snapshot-card-body">
          <h3 className="snapshot-card-title">{story.title}</h3>
          <p className="snapshot-card-subtitle">{story.subtitle}</p>
          <div className="snapshot-card-meta">
            <span>{count} Photos</span>
            <span className="snapshot-card-arrow" aria-hidden>
              →
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

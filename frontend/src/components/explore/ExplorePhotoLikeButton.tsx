'use client';

import { Heart } from 'lucide-react';
import { authService } from '@/services/authService';
import { useSavedPlace } from '@/hooks/useSavedPlace';
import { explorePhotoSaveMeta, type ExplorePhotoDto } from '@/lib/explorePhotos';

type Props = {
  item: ExplorePhotoDto;
  className?: string;
  size?: 'sm' | 'md';
  stopPropagation?: boolean;
};

export function ExplorePhotoLikeButton({
  item,
  className = '',
  size = 'md',
  stopPropagation = true,
}: Props) {
  const meta = explorePhotoSaveMeta(item);
  const { saved, busy, toggle } = useSavedPlace(meta);
  const isLoggedIn = Boolean(authService.getCurrentUser()?.token);
  const dim = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';
  const icon = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <button
      type="button"
      aria-label={
        !isLoggedIn
          ? 'Sign in to like this photo'
          : saved
            ? 'Remove from liked photos'
            : 'Like and save to your dashboard'
      }
      aria-pressed={saved}
      disabled={busy}
      onClick={(e) => {
        if (stopPropagation) {
          e.stopPropagation();
          e.preventDefault();
        }
        void toggle(e);
      }}
      className={`${dim} rounded-full bg-white/95 shadow-md grid place-items-center text-[color:var(--terracotta)] hover:scale-105 transition-transform disabled:opacity-60 ${className}`}
    >
      <Heart className={`${icon} ${saved ? 'fill-current' : ''}`} />
    </button>
  );
}

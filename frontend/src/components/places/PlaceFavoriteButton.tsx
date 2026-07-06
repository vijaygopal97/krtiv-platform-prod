'use client';

import { Heart } from 'lucide-react';
import type { SavedPlaceMeta } from '@/lib/savePlaceSlug';
import { authService } from '@/services/authService';
import { useSavedPlace } from '@/hooks/useSavedPlace';

type Props = SavedPlaceMeta & {
  className?: string;
  size?: 'sm' | 'md';
};

export function PlaceFavoriteButton({ className = '', size = 'md', ...meta }: Props) {
  const { saved, busy, toggle } = useSavedPlace(meta);
  const isLoggedIn = Boolean(authService.getCurrentUser()?.token);
  const dim = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';
  const icon = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <button
      type="button"
      aria-label={
        !isLoggedIn
          ? 'Sign in to save this place'
          : saved
            ? 'Remove from saved places'
            : 'Save to your account'
      }
      aria-pressed={saved}
      disabled={busy}
      onClick={(e) => void toggle(e)}
      className={`${dim} rounded-full bg-white/95 shadow grid place-items-center text-[#C46B2D] hover:scale-105 transition-transform disabled:opacity-60 ${className}`}
    >
      <Heart className={`${icon} ${saved ? 'fill-current' : ''}`} />
    </button>
  );
}

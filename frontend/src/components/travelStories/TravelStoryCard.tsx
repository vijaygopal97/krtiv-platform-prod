'use client';

import Link from 'next/link';
import { useCallback, useRef, type RefObject } from 'react';
import { motion } from 'framer-motion';
import type { TravelStoryDestination } from '@/types/travelStory';
import { useIntentTap } from '@/hooks/useIntentTap';
import type { TapGuard } from '@/hooks/useTravelStoriesTapGuard';
import { PlaceFavoriteButton } from '@/components/places/PlaceFavoriteButton';
import { resolveSaveSlug } from '@/lib/savePlaceSlug';

type Props = {
  destination: TravelStoryDestination;
  index: number;
  onWatch: (trigger: HTMLButtonElement) => void;
  tapGuardRef?: RefObject<TapGuard | null>;
};

export function TravelStoryCard({ destination, index, onWatch, tapGuardRef }: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const open = useCallback(() => {
    if (btnRef.current) onWatch(btnRef.current);
  }, [onWatch]);

  const tap = useIntentTap(open, tapGuardRef);

  return (
    <motion.article
      className="travel-story-card"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.36), ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        ref={btnRef}
        type="button"
        data-story-watch
        className="travel-story-card__btn"
        {...tap}
      >
        <div className="travel-story-card__frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={destination.coverImage}
            alt=""
            className="travel-story-card__image"
            loading={index < 5 ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
          />
          <div className="travel-story-card__gradient" />

          <div className="travel-story-card__top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={destination.avatarImage}
              alt=""
              className="travel-story-card__avatar"
              loading="lazy"
              draggable={false}
            />
            <div className="travel-story-card__meta">
              <p className="travel-story-card__place">{destination.title}</p>
              <p className="travel-story-card__category">{destination.category}</p>
            </div>
            <PlaceFavoriteButton
              slug={resolveSaveSlug({ slug: destination.slug, prefix: 'story' })}
              title={destination.title}
              image={destination.coverImage}
              locationLabel={destination.category}
              source="travel-story"
              className="ml-auto shrink-0"
              size="sm"
            />
          </div>

          <div className="travel-story-card__bottom">
            <p className="travel-story-card__highlight">{destination.highlight}</p>
            <p className="travel-story-card__desc">{destination.description}</p>
            <span className="travel-story-card__cta">
              Watch Story <span aria-hidden>→</span>
            </span>
          </div>
        </div>
      </button>
    </motion.article>
  );
}

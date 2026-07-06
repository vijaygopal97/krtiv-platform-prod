'use client';

import { useRouter } from 'next/navigation';
import { resolveSlideImage } from '@/lib/heroSlidesApi';
import { motion } from 'framer-motion';
import type { JourneyCard } from '@/types/journey';
import { journeyPath } from '@/types/journey';
import { PlaceFavoriteButton } from '@/components/places/PlaceFavoriteButton';
import { resolveSaveSlug } from '@/lib/savePlaceSlug';

type Props = {
  journey: JourneyCard;
  className?: string;
  aspectClass?: string;
  showBlurb?: boolean;
};

export function JourneyInteractiveCard({
  journey,
  className = '',
  aspectClass = 'aspect-[16/10]',
  showBlurb = false,
}: Props) {
  const router = useRouter();
  const image = resolveSlideImage(journey.heroImage || journey.image || '');

  return (
    <motion.article
      role="link"
      tabIndex={0}
      onClick={() => router.push(journeyPath(journey.slug))}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          router.push(journeyPath(journey.slug));
        }
      }}
      className={`group relative overflow-hidden rounded-[20px] cursor-pointer shadow-[0_12px_40px_-18px_rgba(0,0,0,0.35)] transition-shadow duration-500 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] ${aspectClass} ${className}`}
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06] opacity-95 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/80" />
      <PlaceFavoriteButton
        slug={resolveSaveSlug({ slug: journey.slug, locationLabel: journey.region, prefix: 'journey' })}
        title={journey.title}
        image={image}
        locationLabel={journey.region}
        source="journey"
        className="absolute top-4 right-4 z-10"
        size="sm"
      />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10 text-white">
        <p className="text-[11px] tracking-[0.3em] uppercase text-white/80">{journey.region}</p>
        <h3
          className={`font-display mt-2 text-balance ${showBlurb ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'}`}
        >
          {journey.title}
        </h3>
        {showBlurb && journey.blurb ? (
          <p className="mt-4 max-w-md text-white/85 text-[15px] leading-relaxed">{journey.blurb}</p>
        ) : null}
        <p className="mt-4 text-[13px] tracking-wide text-white/70 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          Read the journey <span aria-hidden>→</span>
        </p>
      </div>
    </motion.article>
  );
}

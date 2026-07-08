'use client';

import Link from 'next/link';
import { ScrollReveal } from '@/components/krtiv/ScrollReveal';
import type { CuratedSpotlight } from '@/data/curatedSpotlights';
import { curatedExperiencePath, type ExperienceSlug } from '@/data/curatedExperiences';
import { monsoonTrailPath, type MonsoonTrailSlug } from '@/data/monsoonTrails';
import { timelessIconPath, type TimelessIconSlug } from '@/data/timelessIcons';
import { unescoSitePath, type UnescoSiteSlug } from '@/data/unescoSites';
import { wineTrailPath, type WineTrailSlug } from '@/data/wineTrailDestinations';
import { weekendGetawayPath, type WeekendGetawaySlug } from '@/data/weekendGetaways';
import { PlaceFavoriteButton } from '@/components/places/PlaceFavoriteButton';
import { resolveSaveSlug } from '@/lib/savePlaceSlug';

type Props = {
  spotlights: CuratedSpotlight[];
  /** When set, cards link to full destination-style guides */
  trailSlug?: 'unesco' | 'seven-wonders' | 'weekend-getaways' | 'nature-trails' | 'monsoon-trails' | 'wine-trail';
};

function detailHref(trail: Props['trailSlug'], slug: string): string | undefined {
  if (trail === 'unesco') return unescoSitePath(slug as UnescoSiteSlug);
  if (trail === 'weekend-getaways') return weekendGetawayPath(slug as WeekendGetawaySlug);
  if (trail === 'nature-trails') return curatedExperiencePath('nature-trails', slug as ExperienceSlug);
  if (trail === 'monsoon-trails') return monsoonTrailPath(slug as MonsoonTrailSlug);
  if (trail === 'seven-wonders') return timelessIconPath(slug as TimelessIconSlug);
  if (trail === 'wine-trail') return wineTrailPath(slug as WineTrailSlug);
  return undefined;
}

export function CuratedSpotlightGrid({ spotlights, trailSlug }: Props) {
  return (
    <ul className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
      {spotlights.map((site, i) => {
        const href = site.cardHref ?? detailHref(trailSlug, site.slug);
        const saveSlug = resolveSaveSlug({
          slug: site.slug,
          relatedHref: site.relatedHref,
          locationLabel: site.location,
        });
        const inner = (
          <article className="group h-full flex flex-col overflow-hidden rounded-[20px] bg-white border hairline hover:border-[color:var(--ink)] transition">
            <div className="relative aspect-[16/10] overflow-hidden bg-[color:var(--bone)]">
              <img
                src={site.image}
                alt={site.title}
                loading={i < 2 ? 'eager' : 'lazy'}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <span className="absolute top-4 left-4 text-[10px] tracking-[0.18em] uppercase bg-white/90 backdrop-blur-sm text-[color:var(--ink)] px-3 py-1.5 rounded-full border hairline">
                {site.badge}
              </span>
              <PlaceFavoriteButton
                slug={saveSlug}
                title={site.title}
                image={site.image}
                locationLabel={site.location}
                source={trailSlug || 'curated'}
                className="absolute top-4 right-4"
              />
            </div>
            <div className="flex flex-col flex-1 p-5 md:p-6">
              <h2 className="font-display text-xl md:text-2xl text-[color:var(--ink)] text-balance group-hover:text-[color:var(--saffron)] transition">
                {site.title}
              </h2>
              <p className="text-sm text-[color:var(--terracotta)] mt-1">{site.location}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--ink-soft)] line-clamp-3">
                {site.summary}
              </p>
              {href ? (
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--saffron)]">
                  Explore full guide <span aria-hidden className="group-hover:translate-x-0.5 transition">→</span>
                </span>
              ) : null}
            </div>
          </article>
        );

        return (
          <ScrollReveal key={site.slug} delay={i * 40}>
            <li>
              {href ? (
                <Link href={href} className="block h-full">
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </li>
          </ScrollReveal>
        );
      })}
    </ul>
  );
}

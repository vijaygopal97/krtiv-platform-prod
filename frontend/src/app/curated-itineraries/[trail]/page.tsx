import Link from 'next/link';
import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { ScrollReveal } from '@/components/krtiv/ScrollReveal';
import { DestinationFactsSection } from '@/components/krtiv/DestinationFactsSection';
import { CuratedSpotlightGrid } from '@/components/krtiv/CuratedSpotlightGrid';
import { CuratedTrailAmbientShell } from '@/components/krtiv/CuratedTrailAmbientShell';
import {
  getCuratedTrail,
  getCuratedTrailPlaces,
  getCuratedTrailSpotlights,
  trailUsesSpotlights,
  type CuratedTrailSlug,
} from '@/data/curatedItineraries';
import { getTimelessIconTrailFacts, getUnescoTrailFacts } from '@/data/destinationFacts';
import { CURATED_ITINERARIES_LABEL, SITE_HEADER_OFFSET_CLASS } from '@/lib/siteNavigation';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ trail: string }> };

export async function generateStaticParams() {
  return [
    { trail: 'unesco' },
    { trail: 'seven-wonders' },
    { trail: 'weekend-getaways' },
    { trail: 'wine-trail' },
    { trail: 'nature-trails' },
    { trail: 'monsoon-trails' },
  ];
}

export async function generateMetadata({ params }: Props) {
  const { trail } = await params;
  const config = getCuratedTrail(trail);
  if (!config) return { title: `${CURATED_ITINERARIES_LABEL} — Maharashtra Tourism` };
  return {
    title: `${config.title} — ${CURATED_ITINERARIES_LABEL} — Maharashtra Tourism`,
    description: config.description,
  };
}

export default async function CuratedItineraryTrailPage({ params }: Props) {
  const { trail } = await params;
  const config = getCuratedTrail(trail);
  if (!config) notFound();

  const slug = config.slug as CuratedTrailSlug;
  const showSpotlights = trailUsesSpotlights(slug);
  const spotlights = showSpotlights ? getCuratedTrailSpotlights(slug) : [];
  const places = showSpotlights ? [] : getCuratedTrailPlaces(slug);
  const trailFacts =
    slug === 'unesco'
      ? getUnescoTrailFacts()
      : slug === 'seven-wonders'
        ? getTimelessIconTrailFacts()
        : null;

  return (
    <CuratedTrailAmbientShell>
      <SiteHeaderClient variant="solid" />
      <section className={`${SITE_HEADER_OFFSET_CLASS} pb-16 md:pb-24`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10">
          <ScrollReveal>
            <p className="eyebrow">{config.eyebrow}</p>
            <div className="mt-5 grid md:grid-cols-12 gap-6 md:gap-y-8 md:gap-x-14 lg:gap-x-20 items-center">
              <h1 className="display-xl md:col-span-5 text-balance text-center md:text-left">
                {config.title}
              </h1>
              <div className="md:col-span-7 flex min-h-0 items-center justify-center md:px-6 lg:px-10">
                <p className="lede text-center max-w-md lg:max-w-xl mx-auto">{config.description}</p>
              </div>
            </div>
          </ScrollReveal>

          {trailFacts?.length ? (
            <div className="mt-8 md:mt-10">
              <DestinationFactsSection facts={trailFacts} placeName={config.title} embedded />
            </div>
          ) : null}

          {showSpotlights ? (
            <CuratedSpotlightGrid
              spotlights={spotlights}
              trailSlug={
                config.slug === 'unesco' ||
                config.slug === 'seven-wonders' ||
                config.slug === 'weekend-getaways' ||
                config.slug === 'nature-trails' ||
                config.slug === 'monsoon-trails'
                  ? config.slug
                  : undefined
              }
            />
          ) : (
            <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {places.map((p, i) => (
                <ScrollReveal key={p.slug} delay={i * 40}>
                  <li>
                    <Link
                      href={p.href}
                      className="flex min-h-[56px] items-center justify-between px-5 py-4 rounded-2xl bg-white border hairline hover:border-[color:var(--ink)] transition group"
                    >
                      <span className="font-display text-lg group-hover:text-[color:var(--saffron)] transition">
                        {p.label}
                      </span>
                      <span className="text-[color:var(--ink-soft)] group-hover:translate-x-0.5 transition" aria-hidden>
                        →
                      </span>
                    </Link>
                  </li>
                </ScrollReveal>
              ))}
            </ul>
          )}

          <p className="mt-10 text-sm text-[color:var(--ink-soft)]">
            <Link href="/places-to-go" className="underline underline-offset-4 hover:text-[color:var(--ink)]">
              Browse all curated destinations
            </Link>
          </p>
        </div>
      </section>
      <SiteFooter />
    </CuratedTrailAmbientShell>
  );
}

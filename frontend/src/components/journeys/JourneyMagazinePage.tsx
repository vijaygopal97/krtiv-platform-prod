'use client';

import { useCallback, useEffect, useState } from 'react';
import { ImageGalleryStrip } from '@/components/krtiv/ImageGalleryStrip';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { Editable } from '@/components/cms/Editable';
import { EditableImage } from '@/components/cms/EditableImage';
import { JourneyInteractiveCard } from '@/components/journeys/JourneyInteractiveCard';
import { StoryProse } from '@/components/journeys/StoryProse';
import { journeyCmsKey } from '@/lib/journeyApi';
import { resolveSlideImage } from '@/lib/heroSlidesApi';
import { PLAN_WITH_AI_HREF } from '@/lib/siteNavigation';
import type { JourneyCard, JourneyRecord } from '@/types/journey';
import '@/styles/journey-magazine.css';

type Props = {
  journey: JourneyRecord;
  related: JourneyCard[];
};

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      className="journey-section"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {eyebrow ? <p className="eyebrow text-[color:var(--saffron)]">{eyebrow}</p> : null}
      <h2 className="display-md mt-3 text-balance">{title}</h2>
      <div className="mt-8">{children}</div>
    </motion.section>
  );
}

function Gallery({ images }: { images: string[]; slug: string }) {
  return <ImageGalleryStrip images={images} />;
}

function ShareBar({ title }: { title: string }) {
  const [pageUrl, setPageUrl] = useState('');

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const share = useCallback(async () => {
    const url = pageUrl || window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* cancelled */
      }
      return;
    }
    await navigator.clipboard.writeText(url);
  }, [title, pageUrl]);

  const urlEnc = encodeURIComponent(pageUrl);
  const text = encodeURIComponent(title);

  return (
    <div className="journey-share">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${urlEnc}`}
        target="_blank"
        rel="noopener noreferrer"
        className="journey-share__btn"
      >
        Facebook
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${urlEnc}&text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="journey-share__btn"
      >
        X
      </a>
      <a
        href={`https://wa.me/?text=${text}%20${urlEnc}`}
        target="_blank"
        rel="noopener noreferrer"
        className="journey-share__btn"
      >
        WhatsApp
      </a>
      <button type="button" className="journey-share__btn" onClick={share}>
        Copy link
      </button>
    </div>
  );
}

export function JourneyMagazinePage({ journey, related }: Props) {
  const slug = journey.slug;
  const ck = (field: string) => journeyCmsKey(slug, field);
  const gallery = journey.gallery || [];
  const mapQuery = journey.map?.query || journey.location || journey.title;
  const mapSrc =
    journey.map?.lat && journey.map?.lng
      ? `https://maps.google.com/maps?q=${journey.map.lat},${journey.map.lng}&z=11&output=embed`
      : `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=11&output=embed`;

  return (
    <main className="journey-magazine bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <SiteHeaderClient variant="solid" />

      <header className="journey-hero">
        <div className="journey-hero__media">
          <EditableImage
            cmsKey={ck('heroImage')}
            defaultSrc={journey.heroImage || ''}
            alt=""
            className="journey-hero__img"
          />
        </div>
        <div className="journey-hero__overlay" />
        <div className="journey-hero__content max-w-[1200px] mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="journey-hero__tags">
              <Editable cmsKey={ck('location')} defaultValue={journey.location || ''} as="span" className="journey-hero__tag" />
              <Editable cmsKey={ck('category')} defaultValue={journey.category || ''} as="span" className="journey-hero__tag" />
              <Editable cmsKey={ck('readingTime')} defaultValue={journey.readingTime || ''} as="span" className="journey-hero__tag" />
            </div>
            <h1 className="display-xl text-white mt-4 text-balance max-w-4xl">
              <Editable cmsKey={ck('title')} defaultValue={journey.title} as="span" />
            </h1>
            <p className="journey-hero__lede mt-6 max-w-2xl text-white/90 text-lg leading-relaxed">
              <Editable
                cmsKey={ck('shortDescription')}
                defaultValue={journey.shortDescription || ''}
                as="span"
              />
            </p>
          </motion.div>
        </div>
      </header>

      <nav className="max-w-[1200px] mx-auto px-6 md:px-10 py-4 text-xs text-[color:var(--ink-soft)]" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[color:var(--saffron)]">
          Home
        </Link>
        <span aria-hidden> / </span>
        <span className="text-[color:var(--ink)]">{journey.title}</span>
      </nav>

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 pb-24 md:pb-36 space-y-20 md:space-y-28">
        <Section eyebrow="Story" title="About this journey">
          <StoryProse sections={journey.storySections} fallback={journey.story} />
        </Section>

        {journey.highlights?.length ? (
          <Section title="Highlights">
            <ul className="journey-highlights">
              {journey.highlights.map((h) => (
                <li key={h.label}>
                  <span className="journey-highlights__icon" aria-hidden>
                    {h.icon || '✓'}
                  </span>
                  <div>
                    <p className="font-display text-lg">{h.label}</p>
                    {h.detail ? <p className="text-sm text-[color:var(--ink-soft)] mt-1">{h.detail}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {gallery.length ? (
          <Section title="Gallery">
            <Gallery images={gallery} slug={slug} />
          </Section>
        ) : null}

        {journey.experiences?.length ? (
          <Section title="Things to experience">
            <div className="journey-exp-grid">
              {journey.experiences.map((ex) => (
                <article key={ex.label} className="journey-exp-card">
                  <span className="text-2xl" aria-hidden>
                    {ex.icon}
                  </span>
                  <h3 className="font-display text-xl mt-3">{ex.label}</h3>
                  {ex.detail ? <p className="text-sm text-[color:var(--ink-soft)] mt-2">{ex.detail}</p> : null}
                </article>
              ))}
            </div>
          </Section>
        ) : null}

        {journey.itinerary?.length ? (
          <Section title="Suggested itinerary">
            <ol className="journey-timeline">
              {journey.itinerary.map((step) => (
                <li key={step.title + step.time}>
                  <span className="journey-timeline__time">{step.time}</span>
                  <div>
                    <p className="font-display text-lg">{step.title}</p>
                    {step.description ? (
                      <p className="text-sm text-[color:var(--ink-soft)] mt-1">{step.description}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        ) : null}

        {journey.travelInfo ? (
          <Section title="Travel information">
            <dl className="journey-info-grid">
              {Object.entries(journey.travelInfo).map(([key, val]) =>
                val ? (
                  <div key={key}>
                    <dt className="journey-info-grid__label">{formatInfoLabel(key)}</dt>
                    <dd className="journey-info-grid__value">{val}</dd>
                  </div>
                ) : null
              )}
            </dl>
          </Section>
        ) : null}

        {journey.localFood?.length ? (
          <Section title="Local food">
            <ul className="journey-food-list">
              {journey.localFood.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>
        ) : null}

        {journey.travelTips?.length ? (
          <Section title="Travel tips">
            <ul className="journey-tips">
              {journey.travelTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </Section>
        ) : null}

        {journey.nearby?.length ? (
          <Section title="Nearby attractions">
            <div className="grid sm:grid-cols-2 gap-6">
              {journey.nearby.map((n) => (
                <JourneyInteractiveCard
                  key={n.slug}
                  journey={{
                    slug: n.slug,
                    title: n.title,
                    region: n.region || '',
                    heroImage: n.image,
                    blurb: '',
                    cardLayout: 'compact',
                  }}
                  aspectClass="aspect-[16/9]"
                />
              ))}
            </div>
          </Section>
        ) : null}

        <Section title="Map">
          <div className="journey-map-wrap">
            <iframe
              title="Destination map"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Section>

        {related.length ? (
          <Section title="Related journeys">
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => (
                <JourneyInteractiveCard key={r.slug} journey={r} aspectClass="aspect-[4/5]" />
              ))}
            </div>
          </Section>
        ) : null}

        <Section title="Share this journey">
          <ShareBar title={journey.title} />
        </Section>

        <motion.section
          className="journey-cta-banner"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="display-md text-white text-balance">Ready to explore Maharashtra?</h2>
          <p className="mt-4 text-white/80 max-w-lg">
            Turn this story into a real itinerary — tuned to your pace, interests, and travel dates.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={PLAN_WITH_AI_HREF} className="journey-cta-banner__btn journey-cta-banner__btn--primary">
              Plan your trip
            </Link>
            <Link href="/dashboard" className="journey-cta-banner__btn">
              Generate AI itinerary
            </Link>
          </div>
        </motion.section>
      </div>

      <SiteFooter />
    </main>
  );
}

function formatInfoLabel(key: string) {
  const map: Record<string, string> = {
    location: 'Location',
    nearestAirport: 'Nearest airport',
    nearestRailway: 'Nearest railway',
    roadConnectivity: 'Road connectivity',
    entryFees: 'Entry fees',
    timings: 'Timings',
    duration: 'Duration',
    difficulty: 'Difficulty',
    bestSeason: 'Best season',
    idealFor: 'Ideal for',
  };
  return map[key] || key;
}

'use client';

import { ImageGalleryStrip } from '@/components/krtiv/ImageGalleryStrip';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { StoryProse } from '@/components/journeys/StoryProse';
import { resolveSlideImage } from '@/lib/heroSlidesApi';
import { PLAN_WITH_AI_HREF } from '@/lib/siteNavigation';
import { CATEGORY_ACTIVITY_READ_TIME, type ActivityRecord } from '@/types/activity';
import '@/styles/journey-magazine.css';

type Props = {
  activity: ActivityRecord;
  related: ActivityRecord[];
};

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
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

export function ActivityMagazinePage({ activity, related }: Props) {
  const hero = activity.heroImage ? resolveSlideImage(activity.heroImage) : '';
  const gallery = (activity.gallery || []).map((g) => resolveSlideImage(g));
  const mapQuery = activity.map?.query || activity.location || activity.title;
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=11&output=embed`;

  return (
    <main className="journey-magazine bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <SiteHeaderClient variant="solid" />

      <header className="journey-hero">
        <div className="journey-hero__media">
          {hero ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero} alt="" className="journey-hero__img" />
          ) : null}
        </div>
        <div className="journey-hero__overlay" />
        <div className="journey-hero__content max-w-[1200px] mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="journey-hero__tags">
              {activity.location ? <span className="journey-hero__tag">{activity.location}</span> : null}
              {activity.category ? <span className="journey-hero__tag">{activity.category}</span> : null}
              {activity.readingTime ? (
                <span className="journey-hero__tag">{CATEGORY_ACTIVITY_READ_TIME}</span>
              ) : null}
            </div>
            <h1 className="display-xl text-white mt-5 text-balance max-w-4xl">{activity.title}</h1>
            {activity.shortDescription ? (
              <p className="journey-hero__lede mt-6 max-w-2xl text-white/90 text-lg leading-relaxed">
                {activity.shortDescription}
              </p>
            ) : null}
          </motion.div>
        </div>
      </header>

      <nav className="max-w-[1200px] mx-auto px-6 md:px-10 py-4 text-xs text-[color:var(--ink-soft)]" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[color:var(--saffron)]">
          Home
        </Link>
        <span aria-hidden> / </span>
        <span className="text-[color:var(--ink)]">{activity.title}</span>
      </nav>

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 pb-24 md:pb-36 space-y-20 md:space-y-28">
        <Section eyebrow="Guide" title="About this activity">
          <StoryProse sections={activity.storySections} />
        </Section>

        {activity.highlights?.length ? (
          <Section title="Highlights">
            <ul className="journey-highlights">
              {activity.highlights.map((h) => (
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
            <ImageGalleryStrip images={gallery} />
          </Section>
        ) : null}

        {activity.experiences?.length ? (
          <Section title="What to expect">
            <div className="journey-exp-grid">
              {activity.experiences.map((ex) => (
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

        {activity.travelInfo ? (
          <Section title="Practical information">
            <dl className="journey-info-grid">
              {Object.entries(activity.travelInfo).map(([key, val]) =>
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

        {activity.travelTips?.length ? (
          <Section title="Travel tips">
            <ul className="journey-tips">
              {activity.travelTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </Section>
        ) : null}

        <Section title="Map">
          <div className="journey-map-wrap">
            <iframe title="Activity location map" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
        </Section>

        {related.length ? (
          <Section title="More activities">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => {
                const img = r.heroImage ? resolveSlideImage(r.heroImage) : '';
                return (
                  <Link
                    key={r.slug}
                    href={`/activities/${r.slug}`}
                    className="group block overflow-hidden rounded-[16px] border hairline bg-white"
                  >
                    <div className="aspect-[16/10] relative overflow-hidden">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : null}
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-lg">{r.title}</h3>
                      <p className="text-sm text-[color:var(--ink-soft)] mt-1 line-clamp-2">{r.excerpt}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Section>
        ) : null}

        <motion.section
          className="journey-cta-banner"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="display-md text-white text-balance">Ready to plan this into your trip?</h2>
          <p className="mt-4 text-white/80 max-w-lg">
            Add this experience to a personalised Maharashtra itinerary shaped around your dates and interests.
          </p>
          <div className="mt-8">
            <Link href={PLAN_WITH_AI_HREF} className="journey-cta-banner__btn journey-cta-banner__btn--primary">
              Generate itinerary
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
    bestSeason: 'Best season',
    duration: 'Duration',
    idealFor: 'Ideal for',
  };
  return map[key] || key;
}

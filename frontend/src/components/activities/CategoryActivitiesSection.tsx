'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { resolveSlideImage } from '@/lib/heroSlidesApi';
import { activityPath, CATEGORY_ACTIVITY_READ_TIME, type ActivityRecord } from '@/types/activity';
import { PlaceFavoriteButton } from '@/components/places/PlaceFavoriteButton';
import { resolveSaveSlug } from '@/lib/savePlaceSlug';

type Props = {
  activities: ActivityRecord[];
};

export function CategoryActivitiesSection({ activities }: Props) {
  const router = useRouter();
  if (!activities.length) return null;

  return (
    <section className="relative bg-[color:var(--ivory)] py-24 md:py-36 border-t hairline">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="mb-12 md:mb-16 max-w-3xl">
          <p className="eyebrow text-[color:var(--saffron)]">On the ground</p>
          <h2 className="display-lg mt-4 text-balance">Activities to do</h2>
          <p className="lede mt-4 text-[color:var(--ink-soft)]">
            Go deeper into the places in your itinerary — guided experiences, treks, and cultural
            moments across Maharashtra.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {activities.map((activity, i) => {
            const src = activity.heroImage ? resolveSlideImage(activity.heroImage) : '';
            return (
              <motion.article
                key={activity.slug}
                role="link"
                tabIndex={0}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                onClick={() => router.push(activityPath(activity.slug))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    router.push(activityPath(activity.slug));
                  }
                }}
                className="group cursor-pointer flex flex-col overflow-hidden rounded-[20px] bg-white border hairline shadow-[0_12px_40px_-20px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_50px_-16px_rgba(0,0,0,0.3)] transition-shadow duration-500"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--bone)]">
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  {activity.readingTime ? (
                    <span className="absolute top-3 left-3 rounded-full bg-black/45 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/90">
                      {CATEGORY_ACTIVITY_READ_TIME}
                    </span>
                  ) : null}
                  <PlaceFavoriteButton
                    slug={resolveSaveSlug({
                      slug: activity.slug,
                      locationLabel: activity.location,
                      prefix: 'activity',
                    })}
                    title={activity.title}
                    image={src}
                    locationLabel={activity.location}
                    source="activity"
                    lat={activity.map?.lat}
                    lng={activity.map?.lng}
                    className="absolute top-3 right-3"
                    size="sm"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  {activity.location ? (
                    <p className="text-[11px] tracking-[0.2em] uppercase text-[color:var(--ink-soft)]">
                      {activity.location}
                    </p>
                  ) : null}
                  <h3 className="font-display text-xl md:text-2xl mt-2 text-balance text-[color:var(--ink)] group-hover:text-[color:var(--saffron)] transition-colors">
                    {activity.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--ink-soft)] line-clamp-3 flex-1">
                    {activity.excerpt || activity.shortDescription}
                  </p>
                  <p className="mt-4 text-[13px] font-medium text-[color:var(--ink)] opacity-70 group-hover:opacity-100 transition-opacity">
                    Read the guide <span aria-hidden>→</span>
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

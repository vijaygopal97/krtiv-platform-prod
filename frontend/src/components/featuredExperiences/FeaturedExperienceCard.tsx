'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { resolveSlideImage } from '@/lib/heroSlidesApi';
import type { FeaturedCategory } from '@/types/experienceBlog';
import '@/styles/featured-experiences.css';

type Props = {
  category: FeaturedCategory;
  index: number;
};

export function FeaturedExperienceCard({ category, index }: Props) {
  const cover = resolveSlideImage(category.coverImage || '');
  const activities = [...(category.activities || [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );
  const exploreHref = category.exploreHref || '/explore';

  return (
    <motion.article
      className="fe-card"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.08, 0.32), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
    >
      <div className="fe-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={category.title}
          className="fe-card__image"
          loading="lazy"
          decoding="async"
        />
        <div className="fe-card__media-gradient" />
      </div>

      <div className="fe-card__body">
        <h3 className="fe-card__title">{category.title}</h3>
        {category.description ? (
          <p className="fe-card__desc">{category.description}</p>
        ) : null}

        <ul className="fe-card__activities" aria-label={`Activities in ${category.title}`}>
          {activities.map((act) => (
            <li key={act.blogSlug}>
              <Link href={`/blog/${act.blogSlug}`} className="fe-activity-link">
                <span>{act.title}</span>
                <span className="fe-activity-link__arrow" aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Link href={exploreHref} className="fe-card__explore">
          Explore All
        </Link>
      </div>
    </motion.article>
  );
}

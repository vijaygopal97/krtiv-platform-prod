'use client';

import { useEffect, useState } from 'react';
import { ScrollReveal } from '@/components/krtiv/ScrollReveal';
import { fetchFeaturedCategories } from '@/lib/experienceBlogApi';
import type { FeaturedCategory } from '@/types/experienceBlog';
import { FeaturedExperienceCard } from './FeaturedExperienceCard';
import '@/styles/featured-experiences.css';

export function FeaturedExperiencesSection() {
  const [categories, setCategories] = useState<FeaturedCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="featured-experiences"
      className="fe-section bg-[color:var(--ivory)] py-12 md:py-20"
      aria-labelledby="featured-experiences-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <ScrollReveal className="max-w-3xl mb-6 md:mb-8">
          <p className="eyebrow">Curated collections</p>
          <h2 id="featured-experiences-heading" className="display-lg mt-4 text-balance">
            Featured Experiences
          </h2>
          <p className="lede mt-5 text-[color:var(--ink-soft)]">
            Discover handpicked travel ideas, scenic routes, hidden gems, monsoon escapes, and
            unforgettable experiences across Maharashtra.
          </p>
        </ScrollReveal>

        {loading ? (
          <p className="text-sm text-[color:var(--ink-soft)]" role="status">
            Loading featured experiences…
          </p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-[color:var(--ink-soft)]">
            Curated collections will appear here soon.
          </p>
        ) : (
          <div className="fe-grid">
            {categories.map((cat, i) => (
              <FeaturedExperienceCard key={cat.slug} category={cat} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

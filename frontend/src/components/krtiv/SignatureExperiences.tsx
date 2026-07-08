'use client';

import { useEffect, useState } from 'react';
import { ScrollReveal } from '@/components/krtiv/ScrollReveal';
import { fetchJourneyCards } from '@/lib/journeyApi';
import type { JourneyCard } from '@/types/journey';
import { JourneyInteractiveCard } from '@/components/journeys/JourneyInteractiveCard';

export function SignatureExperiences() {
  const [cards, setCards] = useState<JourneyCard[]>([]);

  useEffect(() => {
    fetchJourneyCards().then(setCards).catch(() => setCards([]));
  }, []);

  const featured = cards.find((c) => c.cardLayout === 'featured') || cards[0];
  const compact = cards.filter((c) => c.slug !== featured?.slug).slice(0, 2);

  return (
    <section className="relative bg-[color:var(--ivory)] py-12 md:py-20">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <ScrollReveal className="mb-6 md:mb-8 max-w-3xl">
          <p className="eyebrow">Signature moments</p>
          <h2 className="display-lg mt-4 text-balance">
            Three afternoons that stay with you for years.
          </h2>
        </ScrollReveal>

        {cards.length === 0 ? (
          <p className="text-[color:var(--ink-soft)] text-sm">Loading journeys…</p>
        ) : (
          <div className="grid md:grid-cols-12 gap-6 md:gap-8 w-full">
            {featured ? (
              <ScrollReveal className="md:col-span-7">
                <JourneyInteractiveCard
                  journey={featured}
                  aspectClass="aspect-[16/11]"
                  showBlurb
                />
              </ScrollReveal>
            ) : null}
            <div className="md:col-span-5 grid grid-cols-1 gap-6 md:gap-8">
              {compact.map((e, i) => (
                <ScrollReveal key={e.slug} delay={(i + 1) * 120}>
                  <JourneyInteractiveCard journey={e} aspectClass="aspect-[16/10]" />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

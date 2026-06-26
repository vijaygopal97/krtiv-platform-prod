import { ScrollReveal } from '@/components/krtiv/ScrollReveal';
import Link from 'next/link';
import type { DestinationRecord } from '@/data/destinations';

export function PlaceDestinationExtras({ place }: { place: DestinationRecord }) {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 md:px-10 max-w-[1200px] mx-auto space-y-14 md:space-y-16">
      <ScrollReveal>
        <h2 className="display-md mb-4">Travel tips</h2>
        <ul className="space-y-2 lede">
          {place.travelTips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </ScrollReveal>

      <ScrollReveal delay={60}>
        <h2 className="display-md mb-4">Best time to visit</h2>
        <p className="lede">{place.bestTimeToVisit}</p>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <h2 className="display-md mb-4">Nearby destinations</h2>
        <ul className="flex flex-wrap gap-2 sm:gap-3">
          {place.nearbyDestinations.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                className="inline-flex px-3 sm:px-4 py-2 min-h-[44px] items-center rounded-full border hairline text-sm hover:bg-[color:var(--bone)] transition-colors"
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </ScrollReveal>
    </section>
  );
}

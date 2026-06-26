import Link from 'next/link';
import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { ScrollReveal } from '@/components/krtiv/ScrollReveal';
import { PLACES_NAV, PLACES_TO_GO_LABEL, SITE_HEADER_OFFSET_CLASS } from '@/lib/siteNavigation';

export const metadata = {
  title: `${PLACES_TO_GO_LABEL} — Maharashtra Tourism`,
  description: 'Popular destinations across Maharashtra — itineraries, maps, and travel tips.',
};

export default function PlacesToGoIndexPage() {
  return (
    <main className="bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <SiteHeaderClient variant="solid" />
      <section className={`${SITE_HEADER_OFFSET_CLASS} pb-16 md:pb-24`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10">
          <ScrollReveal>
            <p className="eyebrow">{PLACES_TO_GO_LABEL}</p>
            <h1 className="display-xl mt-5 max-w-3xl text-balance">Where Maharashtra unfolds</h1>
            <p className="lede mt-6 max-w-2xl">
              Choose a destination for a suggested three-day itinerary, map, and local tips.
            </p>
          </ScrollReveal>
          <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {PLACES_NAV.map((p, i) => (
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
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

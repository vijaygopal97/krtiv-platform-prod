import Link from 'next/link';
import { ScrollReveal } from '@/components/krtiv/ScrollReveal';

type Props = {
  topAttractions: string[];
  bestTimeToVisit: string;
  localFood: string[];
  travelTips: string[];
  nearbyDestinations: { label: string; href: string }[];
};

export function DestinationPracticalInfo({
  topAttractions,
  bestTimeToVisit,
  localFood,
  travelTips,
  nearbyDestinations,
}: Props) {
  return (
    <section className="bg-white border-t hairline py-8 md:py-12">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 lg:gap-14">
          <ScrollReveal className="md:col-span-5">
            <p className="eyebrow">Plan your visit</p>
            <h2 className="display-md mt-4 text-balance">Practical essentials</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-[color:var(--ink-soft)]">
              <span className="font-semibold text-[color:var(--ink)]">Best time: </span>
              {bestTimeToVisit}
            </p>
            {nearbyDestinations.length ? (
              <div className="mt-8">
                <p className="text-[11px] tracking-[0.2em] uppercase text-[color:var(--ink-soft)] mb-3">
                  Nearby & related
                </p>
                <ul className="flex flex-wrap gap-2">
                  {nearbyDestinations.map((n) => (
                    <li key={n.href}>
                      <Link
                        href={n.href}
                        className="inline-flex h-9 px-4 items-center rounded-full border hairline text-sm hover:border-[color:var(--ink)] transition"
                      >
                        {n.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </ScrollReveal>
          <div className="md:col-span-7 grid sm:grid-cols-2 gap-8">
            <ScrollReveal delay={60}>
              <h3 className="font-display text-xl mb-4">Must-see highlights</h3>
              <ul className="space-y-2">
                {topAttractions.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-[color:var(--ink-soft)]">
                    <span className="text-[color:var(--saffron)]" aria-hidden>
                      ·
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <h3 className="font-display text-xl mb-4">Local flavours</h3>
              <ul className="space-y-2">
                {localFood.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-[color:var(--ink-soft)]">
                    <span className="text-[color:var(--saffron)]" aria-hidden>
                      ·
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
            <ScrollReveal className="sm:col-span-2" delay={180}>
              <h3 className="font-display text-xl mb-4">Travel tips</h3>
              <ul className="space-y-3">
                {travelTips.map((tip) => (
                  <li key={tip} className="text-sm leading-relaxed text-[color:var(--ink-soft)] pl-4 border-l-2 border-[color:var(--bone)]">
                    {tip}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { ScrollReveal } from './ScrollReveal';
import { IntroStatCard } from './IntroStatCard';
import { Editable } from '@/components/cms/Editable';
import { HOME_INTRO_STATS } from '@/data/homeIntroStats';

export function IntroBand() {
  return (
    <section className="relative bg-[color:var(--bone)] py-24 md:py-32 border-y hairline">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-12 items-end">
        <ScrollReveal className="md:col-span-7">
          <p className="eyebrow">
            <Editable cmsKey="home.intro.eyebrow" defaultValue="An invitation" as="span" />
          </p>
          <h2 className="display-lg mt-4 text-balance">
            <Editable
              cmsKey="home.intro.title"
              defaultValue="A state built like an epic — read it slowly."
              as="span"
            />
          </h2>
        </ScrollReveal>
        <ScrollReveal className="md:col-span-5" delay={120}>
          <p className="lede">
            <Editable
              cmsKey="home.intro.lede"
              defaultValue="Maharashtra is the kind of place that doesn't fit into a weekend. It opens in chapters — the forts, the ghats, the bazaars, the long quiet shoreline. This is a guide for travelers who want to read them in order."
              as="span"
            />
          </p>
        </ScrollReveal>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-10 mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 border-t hairline pt-10">
        {HOME_INTRO_STATS.map((stat, i) => (
          <ScrollReveal key={stat.labelKey} delay={i * 80}>
            <IntroStatCard stat={stat} index={i} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

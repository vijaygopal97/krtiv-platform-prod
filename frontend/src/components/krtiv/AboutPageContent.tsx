'use client';

import { ScrollReveal } from '@/components/krtiv/ScrollReveal';
import { Editable } from '@/components/cms/Editable';

export function AboutPageContent() {
  return (
    <>
      <section className="pb-24 md:pb-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <ScrollReveal>
            <p className="eyebrow">
              <Editable cmsKey="about.main.eyebrow" defaultValue="About us" as="span" />
            </p>
            <h1 className="display-xl mt-5 max-w-4xl text-balance">
              <Editable cmsKey="about.main.title" defaultValue="An invitation, not a brochure." as="span" />
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <p className="lede mt-8 max-w-2xl">
              <Editable
                cmsKey="about.main.lede"
                defaultValue="Maharashtra Tourism is the official, public-facing guide to one of India's most layered states. We don't sell tickets. We tell you what's worth your weekend, your week, your once-in-a-decade trip."
                as="span"
              />
            </p>
          </ScrollReveal>
        </div>
      </section>
      <section className="bg-[color:var(--bone)] border-y hairline py-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-12">
          <ScrollReveal className="md:col-span-5">
            <h2 className="display-md text-balance">
              <Editable cmsKey="about.beliefs.heading" defaultValue="What we believe" as="span" />
            </h2>
          </ScrollReveal>
          <div className="md:col-span-7 space-y-8 text-[17px] leading-relaxed">
            <ScrollReveal delay={100}>
              <p>
                <Editable
                  cmsKey="about.beliefs.p1"
                  defaultValue="A great trip is built one decision at a time. So we treat every page like an editor would — fewer places, more reason."
                  as="span"
                />
              </p>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p>
                <Editable
                  cmsKey="about.beliefs.p2"
                  defaultValue="Behind the writing is an AI planner that does the unglamorous work: weighing your interests, pace and travel companions to draft an itinerary you can edit and live by."
                  as="span"
                />
              </p>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <p>
                <Editable cmsKey="about.beliefs.p3" defaultValue="Maharashtra is a state built like an epic. Read it slowly." as="span" />
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}

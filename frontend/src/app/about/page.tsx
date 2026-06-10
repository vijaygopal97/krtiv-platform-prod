import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { ScrollReveal } from '@/components/krtiv/ScrollReveal';

export const metadata = { title: 'About — Maharashtra Tourism' };

export default function AboutPage() {
  return (
    <main className="bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <SiteHeaderClient variant="solid" />
      <section className="pt-40 pb-24 md:pt-48 md:pb-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <ScrollReveal>
            <p className="eyebrow">About us</p>
            <h1 className="display-xl mt-5 max-w-4xl text-balance">An invitation, not a brochure.</h1>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <p className="lede mt-8 max-w-2xl">
              Maharashtra Tourism is the official, public-facing guide to one of India&apos;s most layered states.
              We don&apos;t sell tickets. We tell you what&apos;s worth your weekend, your week, your once-in-a-decade trip.
            </p>
          </ScrollReveal>
        </div>
      </section>
      <section className="bg-[color:var(--bone)] border-y hairline py-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-12">
          <ScrollReveal className="md:col-span-5">
            <h2 className="display-md text-balance">What we believe</h2>
          </ScrollReveal>
          <div className="md:col-span-7 space-y-8 text-[17px] leading-relaxed">
            <ScrollReveal delay={100}>
              <p>A great trip is built one decision at a time. So we treat every page like an editor would — fewer places, more reason.</p>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p>Behind the writing is an AI planner that does the unglamorous work: weighing your interests, pace and travel companions to draft an itinerary you can edit and live by.</p>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <p>Maharashtra is a state built like an epic. Read it slowly.</p>
            </ScrollReveal>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

'use client';

import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { ScrollReveal } from '@/components/krtiv/ScrollReveal';
import { ContactSocialSection } from '@/components/krtiv/ContactSocialSection';
import SmartKeywordItinerary from '@/components/itinerary/SmartKeywordItinerary';
import { SITE_HEADER_OFFSET_CLASS } from '@/lib/siteNavigation';

export default function ContactPage() {
  return (
    <main className="bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <SiteHeaderClient variant="solid" />
      <section className={`${SITE_HEADER_OFFSET_CLASS} pb-16 md:pb-20`}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <ScrollReveal>
            <p className="eyebrow">Contact</p>
            <h1 className="display-xl mt-5 max-w-3xl text-balance">We answer every note.</h1>
            <p className="lede mt-8 max-w-2xl">
              Whether you&apos;re planning a long weekend or a fifteen-day passage through the state — write in.
              A real person on our team will reply.
            </p>
          </ScrollReveal>
        </div>
      </section>
      <section className="pb-24 md:pb-36">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10">
          <ScrollReveal className="md:col-span-7">
            <form onSubmit={(e) => e.preventDefault()} className="bg-white rounded-[20px] border hairline p-8 md:p-10">
              <div className="grid sm:grid-cols-2 gap-5">
                <label className="block">
                  <span className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">Name</span>
                  <input type="text" className="w-full h-12 px-4 rounded-xl bg-[color:var(--ivory)] border hairline outline-none focus:border-[color:var(--ink)] transition" />
                </label>
                <label className="block">
                  <span className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">Email</span>
                  <input type="email" className="w-full h-12 px-4 rounded-xl bg-[color:var(--ivory)] border hairline outline-none focus:border-[color:var(--ink)] transition" />
                </label>
              </div>
              <label className="block mt-5">
                <span className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">Subject</span>
                <input type="text" className="w-full h-12 px-4 rounded-xl bg-[color:var(--ivory)] border hairline outline-none focus:border-[color:var(--ink)] transition" />
              </label>
              <label className="block mt-5">
                <span className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">Message</span>
                <textarea rows={6} className="w-full p-4 rounded-xl bg-[color:var(--ivory)] border hairline outline-none focus:border-[color:var(--ink)] transition resize-y" />
              </label>
              <button type="submit" className="mt-7 inline-flex items-center gap-2 h-12 px-6 rounded-full bg-[color:var(--ink)] text-white text-sm">
                Send message <span aria-hidden>→</span>
              </button>
            </form>
          </ScrollReveal>
          <ScrollReveal className="md:col-span-5" delay={120}>
            <ContactSocialSection />
          </ScrollReveal>
        </div>
      </section>
      <SmartKeywordItinerary
        context="explore"
        heading="While you&apos;re here — plan your journey"
        subheading="Pick keywords and click Generate My Itinerary for an instant AI day-by-day plan."
        className="border-t hairline bg-[color:var(--bone)]"
        compact
      />
      <SiteFooter />
    </main>
  );
}

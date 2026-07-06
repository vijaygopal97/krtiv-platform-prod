'use client';

import dynamic from 'next/dynamic';
import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { ScrollReveal } from '@/components/krtiv/ScrollReveal';
import { ContactSocialSection } from '@/components/krtiv/ContactSocialSection';
import { SITE_HEADER_OFFSET_CLASS } from '@/lib/siteNavigation';
import { Editable } from '@/components/cms/Editable';
import '@/styles/planner-travel-ambient.css';

const PlannerTravelAmbient = dynamic(
  () =>
    import('@/components/planner/PlannerTravelAmbient').then((mod) => ({
      default: mod.PlannerTravelAmbient,
    })),
  { ssr: false }
);

export default function ContactPage() {
  return (
    <main
      id="contact-page-ambient-root"
      className="relative planner-section-premium text-[color:var(--ink)] overflow-hidden"
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
        <PlannerTravelAmbient observeRootSelector="#contact-page-ambient-root" />
      </div>

      <div className="relative z-[1]">
      <SiteHeaderClient variant="solid" />
      <section className={`${SITE_HEADER_OFFSET_CLASS} pb-16 md:pb-20`}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <ScrollReveal>
            <p className="eyebrow">
              <Editable cmsKey="contact.main.eyebrow" defaultValue="Contact" as="span" />
            </p>
            <h1 className="display-xl mt-5 max-w-3xl text-balance">
              <Editable cmsKey="contact.main.title" defaultValue="We answer every note." as="span" />
            </h1>
            <p className="lede mt-8 max-w-2xl">
              <Editable
                cmsKey="contact.main.lede"
                defaultValue="Whether you're planning a long weekend or a fifteen-day passage through the state — write in. A real person on our team will reply."
                as="span"
              />
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
                <Editable cmsKey="contact.main.submitLabel" defaultValue="Send message" as="span" />{' '}
                <span aria-hidden>→</span>
              </button>
            </form>
          </ScrollReveal>
          <ScrollReveal className="md:col-span-5" delay={120}>
            <ContactSocialSection />
          </ScrollReveal>
        </div>
      </section>
      <SiteFooter />
      </div>
    </main>
  );
}

'use client';

import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { ScrollReveal } from '@/components/krtiv/ScrollReveal';

export default function ContactPage() {
  return (
    <main className="bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <SiteHeaderClient variant="solid" />
      <section className="pt-40 pb-16 md:pt-48 md:pb-20">
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
          <ScrollReveal className="md:col-span-5 space-y-4" delay={120}>
            {[
              { label: 'Email', value: 'info@maharashtratourism.com', href: 'mailto:info@maharashtratourism.com' },
              { label: 'Phone', value: '+91 123 456 7890', href: 'tel:+911234567890' },
              { label: 'Office', value: 'Mantralaya, Mumbai 400032', href: '#' },
              { label: 'Hours', value: 'Mon–Sat, 9 AM – 6 PM IST', href: '#' },
            ].map((c) => (
              <a key={c.label} href={c.href} className="block bg-white rounded-2xl border hairline p-6 hover:border-[color:var(--ink)] transition group">
                <p className="eyebrow">{c.label}</p>
                <p className="mt-2 text-lg font-display text-[color:var(--ink)] group-hover:text-[color:var(--saffron)] transition">{c.value}</p>
              </a>
            ))}
          </ScrollReveal>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

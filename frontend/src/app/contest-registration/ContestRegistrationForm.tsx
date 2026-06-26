'use client';

import { useState, FormEvent } from 'react';
import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import { ScrollReveal } from '@/components/krtiv/ScrollReveal';
import { getApiBase } from '@/lib/basePath';
import { SITE_HEADER_OFFSET_CLASS } from '@/lib/siteNavigation';

const CATEGORIES = [
  'Photography',
  'Travel Story',
  'Short Video',
  'Heritage',
  'Food & Culture',
];

export default function ContestRegistrationForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');
    const form = e.currentTarget;
    const fd = new FormData(form);

    const terms = fd.get('terms') === 'on';
    const privacy = fd.get('privacy') === 'on';
    if (!terms || !privacy) {
      setStatus('error');
      setMessage('Please accept the Terms & Conditions and Privacy Policy.');
      return;
    }

    const file = fd.get('media') as File | null;
    if (file && file.size > 0) {
      const max = 50 * 1024 * 1024;
      if (file.size > max) {
        setStatus('error');
        setMessage('File must be 50 MB or smaller.');
        return;
      }
    }

    try {
      const res = await fetch(`${getApiBase()}/contest-registration`, {
        method: 'POST',
        body: fd,
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Submission failed. Please try again.');
      }
      setStatus('success');
      setMessage('Thank you! Your registration was received. A confirmation email will be sent shortly.');
      form.reset();
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  const inputClass =
    'w-full rounded-xl border hairline bg-white px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-[color:var(--saffron)]/40';

  return (
    <main className="bg-[color:var(--ivory)] text-[color:var(--ink)] min-h-screen">
      <SiteHeaderClient variant="solid" />
      <div className={`${SITE_HEADER_OFFSET_CLASS} pb-24`}>
        <section className="px-6 md:px-10 max-w-[800px] mx-auto py-10 md:py-16">
          <ScrollReveal>
            <p className="eyebrow">Contest</p>
            <h1 className="display-xl mt-4 text-balance">Registration</h1>
            <p className="lede mt-6">
              Share your Maharashtra story — photography, film, or travel writing — and join our official tourism contest.
            </p>
          </ScrollReveal>

          {status === 'success' ? (
            <div className="mt-10 p-6 rounded-2xl bg-green-50 border border-green-200 text-green-900" role="status">
              {message}
            </div>
          ) : (
            <form className="mt-10 space-y-8" onSubmit={onSubmit} noValidate>
              <fieldset className="space-y-4">
                <legend className="font-display text-lg mb-2">Personal information</legend>
                <label className="block">
                  <span className="text-sm text-[color:var(--ink-soft)]">Full name *</span>
                  <input name="fullName" required className={`mt-1 ${inputClass}`} autoComplete="name" />
                </label>
                <label className="block">
                  <span className="text-sm text-[color:var(--ink-soft)]">Email *</span>
                  <input name="email" type="email" required className={`mt-1 ${inputClass}`} autoComplete="email" />
                </label>
                <label className="block">
                  <span className="text-sm text-[color:var(--ink-soft)]">Mobile number *</span>
                  <input name="mobile" type="tel" required pattern="[0-9+\s-]{10,15}" className={`mt-1 ${inputClass}`} />
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm text-[color:var(--ink-soft)]">Date of birth *</span>
                    <input name="dob" type="date" required className={`mt-1 ${inputClass}`} />
                  </label>
                  <label className="block">
                    <span className="text-sm text-[color:var(--ink-soft)]">Gender</span>
                    <select name="gender" className={`mt-1 ${inputClass}`}>
                      <option value="">Prefer not to say</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm text-[color:var(--ink-soft)]">City *</span>
                    <input name="city" required className={`mt-1 ${inputClass}`} />
                  </label>
                  <label className="block">
                    <span className="text-sm text-[color:var(--ink-soft)]">State *</span>
                    <input name="state" required defaultValue="Maharashtra" className={`mt-1 ${inputClass}`} />
                  </label>
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="font-display text-lg mb-2">Participation</legend>
                <label className="block">
                  <span className="text-sm text-[color:var(--ink-soft)]">Contest category *</span>
                  <select name="category" required className={`mt-1 ${inputClass}`}>
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm text-[color:var(--ink-soft)]">Photo or video</span>
                  <input
                    name="media"
                    type="file"
                    accept="image/*,video/*"
                    className={`mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[color:var(--ink)] file:text-white`}
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-[color:var(--ink-soft)]">Description / caption *</span>
                  <textarea name="caption" required rows={4} className={`mt-1 ${inputClass}`} />
                </label>
              </fieldset>

              <fieldset className="space-y-3">
                <legend className="sr-only">Agreements</legend>
                <label className="flex gap-3 items-start text-sm">
                  <input name="terms" type="checkbox" required className="mt-1" />
                  <span>I agree to the Terms &amp; Conditions *</span>
                </label>
                <label className="flex gap-3 items-start text-sm">
                  <input name="privacy" type="checkbox" required className="mt-1" />
                  <span>I agree to the Privacy Policy *</span>
                </label>
              </fieldset>

              {status === 'error' && message ? (
                <p className="text-sm text-red-700" role="alert">
                  {message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="inline-flex h-12 px-8 items-center justify-center rounded-full bg-[color:var(--ink)] text-white text-[14px] font-medium hover:opacity-90 disabled:opacity-60"
              >
                {status === 'submitting' ? 'Submitting…' : 'Register / Submit'}
              </button>
            </form>
          )}
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}

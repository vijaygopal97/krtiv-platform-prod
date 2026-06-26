'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { ScrollReveal } from '@/components/krtiv/ScrollReveal';
import { PLAN_WITH_AI_HREF } from '@/lib/siteNavigation';
import { krtivHeroImage } from '@/lib/krtivPaths';

export function CtaBandInteractive() {
  const router = useRouter();
  const [showSignupLightbox, setShowSignupLightbox] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const handleGenerateClick = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.location.href = PLAN_WITH_AI_HREF;
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    if (!formData.phone.trim()) {
      setFormError('Phone number is required');
      return;
    }
    setFormLoading(true);
    try {
      await authService.register({
        name: formData.name,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim(),
        password: formData.password,
      });
      setShowSignupLightbox(false);
      setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
      router.push('/dashboard');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      <section id="itinerary-generator" className="bg-[color:var(--ivory)] py-24 md:py-36">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="relative overflow-hidden rounded-[24px] grid md:grid-cols-2 min-h-[520px]">
            <div className="relative bg-[color:var(--ink)] text-white p-10 md:p-16 flex flex-col justify-between">
              <ScrollReveal>
                <p className="eyebrow text-white/55">AI itinerary builder</p>
                <h3 className="display-md mt-5 text-balance">
                  Tell us how you travel. We&apos;ll write the days.
                </h3>
                <p className="lede mt-5 text-white/70 max-w-md">
                  Share your interests, pace and the cities you fly from — our planner returns a day-by-day itinerary you can edit, share and live by.
                </p>
              </ScrollReveal>

              <div className="mt-12">
                <button
                  type="button"
                  onClick={handleGenerateClick}
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-[color:var(--saffron)] text-white text-sm font-medium hover:opacity-90 transition"
                >
                  Generate my itinerary <span aria-hidden>→</span>
                </button>
                <ul className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-white/65">
                  <li>
                    <p className="text-white text-base font-display mb-1">Personal</p>
                    Built around your interests and travel companions.
                  </li>
                  <li>
                    <p className="text-white text-base font-display mb-1">Time-aware</p>
                    Optimized hour by hour, not just day by day.
                  </li>
                  <li>
                    <p className="text-white text-base font-display mb-1">Editable</p>
                    Tweak any moment — the rest of the plan adapts.
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative min-h-[320px] md:min-h-full">
              <img
                src={krtivHeroImage()}
                alt="Maharashtra landscape"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent md:bg-gradient-to-r md:from-[color:var(--ink)]/40 md:via-transparent md:to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {showSignupLightbox && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowSignupLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="signup-lightbox-title"
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[color:var(--ivory)] rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowSignupLightbox(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-[color:var(--bone)] hover:bg-[color:var(--sand)] text-[color:var(--ink)] transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <h2 id="signup-lightbox-title" className="display-md text-[color:var(--ink)] mb-2">
                  Sign up to access the Itinerary Generator
                </h2>
                <p className="text-[color:var(--saffron)] font-semibold text-sm">It&apos;s completely free.</p>
                <p className="text-[color:var(--ink-soft)] text-sm mt-2">
                  Create an account to get your personalized Maharashtra itinerary in minutes.
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{formError}</div>
                )}
                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full h-12 px-4 rounded-xl bg-white border hairline text-[15px] outline-none focus:border-[color:var(--ink)]" placeholder="Name" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                  className="w-full h-12 px-4 rounded-xl bg-white border hairline text-[15px] outline-none focus:border-[color:var(--ink)]" placeholder="Phone Number" />
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl bg-white border hairline text-[15px] outline-none focus:border-[color:var(--ink)]" placeholder="Email (optional)" />
                <input type="password" name="password" value={formData.password} onChange={handleChange} required
                  className="w-full h-12 px-4 rounded-xl bg-white border hairline text-[15px] outline-none focus:border-[color:var(--ink)]" placeholder="Password" />
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                  className="w-full h-12 px-4 rounded-xl bg-white border hairline text-[15px] outline-none focus:border-[color:var(--ink)]" placeholder="Confirm Password" />
                <button type="submit" disabled={formLoading}
                  className="w-full h-12 rounded-full bg-[color:var(--ink)] text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50">
                  {formLoading ? 'Creating account...' : 'Sign up & continue to Itinerary Generator'}
                </button>
              </form>

              <p className="text-center text-[color:var(--ink-soft)] text-xs mt-4">
                Already have an account? <Link href="/login" className="text-[color:var(--ink)] font-semibold hover:underline">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

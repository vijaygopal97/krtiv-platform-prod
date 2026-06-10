'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/authService';

export default function CallToAction() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, [showSignupLightbox]);

  const handleGenerateClick = useCallback(() => {
    if (authService.isAuthenticated()) {
      router.push('/dashboard');
    } else {
      setShowSignupLightbox(true);
    }
  }, [router]);

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
      <section id="itinerary-generator" className="relative py-24 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF9933] via-orange-600 to-red-600"></div>
          <div className="absolute inset-0 bg-pattern-warli opacity-10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`
          }}></div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 text-shadow-lg">
              Ready to Start Your
              <br />
              Maharashtra <span className="text-yellow-200">Adventure?</span>
            </h2>
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto mb-10">
              Our AI-powered Itinerary Generator evaluates your preferences and available time to create a personalized journey across Maharashtra—tailored just for you.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-center text-white/90 text-lg md:text-xl mb-8 leading-relaxed">
              Tell us your interests, how many days you have, and we&apos;ll generate the best-suited itinerary with places, timings, and experiences that match your pace.
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleGenerateClick}
                className="group relative px-12 py-6 bg-white hover:bg-gray-50 text-[#FF9933] font-bold text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Generate Itinerary For You
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Smart Preferences</h3>
              <p className="text-orange-100 text-sm">AI understands your interests, pace, and time to craft the perfect trip</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Personalized Itineraries</h3>
              <p className="text-orange-100 text-sm">One-of-a-kind day-by-day plans with places, timings, and experiences</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Time-Optimized</h3>
              <p className="text-orange-100 text-sm">Make the most of your available days with logic-driven scheduling</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-white/80 text-sm mb-3">Need help planning? Our travel experts are here for you</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="tel:+911234567890" className="flex items-center gap-2 text-white font-semibold hover:text-yellow-200 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +91 123 456 7890
              </a>
              <span className="text-white/60 hidden sm:inline">•</span>
              <a href="mailto:info@maharashtratourism.com" className="flex items-center gap-2 text-white font-semibold hover:text-yellow-200 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@maharashtratourism.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sign-up lightbox: responsive, with registration form */}
      {showSignupLightbox && typeof document !== 'undefined' && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowSignupLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="signup-lightbox-title"
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowSignupLightbox(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <h2 id="signup-lightbox-title" className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-2">
                  Sign up to access the Itinerary Generator
                </h2>
                <p className="text-[#FF9933] font-semibold">It&apos;s completely free.</p>
                <p className="text-gray-500 text-sm mt-2">Create an account to get your personalized Maharashtra itinerary in minutes.</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{formError}</div>
                )}
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9933] placeholder-gray-500" placeholder="Name" />
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9933] placeholder-gray-500" placeholder="Phone Number" />
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9933] placeholder-gray-500" placeholder="Email (optional)" />
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9933] placeholder-gray-500" placeholder="Password" />
                <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9933] placeholder-gray-500" placeholder="Confirm Password" />
                <button type="submit" disabled={formLoading}
                  className="w-full bg-gradient-to-r from-[#FF9933] to-orange-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {formLoading ? 'Creating account...' : 'Sign up & continue to Itinerary Generator'}
                </button>
              </form>

              <p className="text-center text-gray-500 text-xs mt-4">
                Already have an account? <Link href="/login" className="text-[#FF9933] font-semibold hover:underline">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

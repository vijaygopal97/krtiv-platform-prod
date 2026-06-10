'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/services/authService';
import { AuthShell } from '@/components/krtiv/AuthShell';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset your password."
      subtitle="We'll send instructions to your email."
      imageQuote="Every great journey has a fresh start."
    >
      {success ? (
        <div className="text-center space-y-4">
          <p className="lede">We&apos;ve sent password reset instructions to your email address.</p>
          <Link href="/login" className="inline-flex h-12 items-center px-6 rounded-full bg-[color:var(--ink)] text-white text-sm">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}
          <label className="block">
            <span className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 px-4 rounded-xl bg-white border hairline text-[15px] outline-none focus:border-[color:var(--ink)] transition"
              placeholder="you@example.com"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-[color:var(--ink)] text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthShell>
  );
}

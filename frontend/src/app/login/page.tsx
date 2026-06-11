'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';
import { AuthShell } from '@/components/krtiv/AuthShell';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/';
  const [formData, setFormData] = useState({ emailOrPhone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.login(formData.emailOrPhone, formData.password);
      router.push(nextPath.startsWith('/') ? nextPath : '/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email/phone or password');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AuthShell
      title="Welcome back."
      subtitle="Sign in to pick up your itinerary where you left it."
      imageQuote="The fort, the ghat, the long quiet shoreline — all still waiting."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}
        <label className="block">
          <span className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">Email or phone</span>
          <input
            type="text"
            name="emailOrPhone"
            value={formData.emailOrPhone}
            onChange={handleChange}
            required
            autoComplete="username"
            className="w-full h-12 px-4 rounded-xl bg-white border hairline text-[15px] outline-none focus:border-[color:var(--ink)] transition"
            placeholder="Email or Phone Number"
          />
        </label>
        <label className="block">
          <span className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">Password</span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            className="w-full h-12 px-4 rounded-xl bg-white border hairline text-[15px] outline-none focus:border-[color:var(--ink)] transition"
            placeholder="Password"
          />
        </label>
        <div className="flex items-center justify-between text-sm">
          <Link href="/forgot-password" className="text-[color:var(--ink)] hover:text-[color:var(--saffron)]">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-full bg-[color:var(--ink)] text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="mt-8 text-sm text-[color:var(--ink-soft)] text-center">
        New here? <Link href="/register" className="text-[color:var(--ink)] underline-offset-4 hover:underline">Create an account</Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen grid place-items-center bg-[color:var(--ivory)]">Loading…</main>}>
      <LoginForm />
    </Suspense>
  );
}

'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.adminLogin(email, password);
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[100svh] bg-[color:var(--ivory)] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border hairline rounded-2xl p-8 md:p-10 shadow-sm">
        <p className="eyebrow">Administration</p>
        <h1 className="display-md mt-3">Content editor sign in</h1>
        <p className="mt-3 text-sm text-[color:var(--ink-soft)]">
          Super Admin and Content Admin accounts only. Use Edit mode in the header after signing in.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-xs text-[color:var(--ink-soft)]">Admin email</span>
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full h-12 px-4 rounded-xl border hairline bg-[color:var(--ivory)]"
            />
          </label>
          <label className="block">
            <span className="text-xs text-[color:var(--ink-soft)]">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full h-12 px-4 rounded-xl border hairline bg-[color:var(--ivory)]"
            />
          </label>
          {error ? (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-[color:var(--ink)] text-white text-sm disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in securely'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-[color:var(--saffron)] hover:underline">
            ← Back to website
          </Link>
        </p>
      </div>
    </main>
  );
}

'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';
import { AuthShell } from '@/components/krtiv/AuthShell';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (!token) {
      setError('Invalid reset token');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(token, formData.password);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AuthShell title="Choose a new password." subtitle="Enter your new password below.">
      {success ? (
        <div className="text-center space-y-4">
          <p className="lede">Your password has been reset. You can sign in with your new password.</p>
          <Link href="/login" className="inline-flex h-12 items-center px-6 rounded-full bg-[color:var(--ink)] text-white text-sm">
            Continue to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}
          <label className="block">
            <span className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">New password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full h-12 px-4 rounded-xl bg-white border hairline text-[15px] outline-none focus:border-[color:var(--ink)] transition"
            />
          </label>
          <label className="block">
            <span className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">Confirm password</span>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full h-12 px-4 rounded-xl bg-white border hairline text-[15px] outline-none focus:border-[color:var(--ink)] transition"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-[color:var(--ink)] text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>
      )}
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[color:var(--ivory)] flex items-center justify-center">
        <p className="text-[color:var(--ink-soft)]">Loading...</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

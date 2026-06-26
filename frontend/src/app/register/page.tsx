'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { AuthShell } from '@/components/krtiv/AuthShell';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import FacebookSignInButton from '@/components/FacebookSignInButton';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
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
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return;
    }
    setLoading(true);
    try {
      await authService.register({
        name: formData.name,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim(),
        password: formData.password,
      });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AuthShell
      title="Create your account."
      subtitle="Free access to the AI itinerary builder — built around how you actually travel."
      imageQuote="Tell us your interests. We'll write the days."
      reverse
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}
        {[
          { name: 'name', type: 'text', label: 'Name', required: true, placeholder: 'Your name' },
          { name: 'phone', type: 'tel', label: 'Phone', required: true, placeholder: 'Phone number' },
          { name: 'email', type: 'email', label: 'Email (optional)', required: false, placeholder: 'Email' },
          { name: 'password', type: 'password', label: 'Password', required: true, placeholder: 'Password' },
          { name: 'confirmPassword', type: 'password', label: 'Confirm password', required: true, placeholder: 'Confirm password' },
        ].map((field) => (
          <label key={field.name} className="block">
            <span className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">{field.label}</span>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleChange}
              required={field.required}
              className="w-full h-12 px-4 rounded-xl bg-white border hairline text-[15px] outline-none focus:border-[color:var(--ink)] transition"
              placeholder={field.placeholder}
            />
          </label>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-full bg-[color:var(--ink)] text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t hairline" />
        </div>
        <p className="relative flex justify-center text-xs uppercase tracking-widest text-[color:var(--ink-soft)]">
          <span className="bg-[color:var(--ivory)] px-3">or</span>
        </p>
      </div>
      <GoogleSignInButton
        mode="signup"
        onSuccess={() => router.push('/dashboard')}
        onError={(m) => setError(m)}
      />
      <div className="mt-3">
        <FacebookSignInButton
          onSuccess={() => router.push('/dashboard')}
          onError={(m) => setError(m)}
          disabled={loading}
        />
      </div>
      <p className="mt-8 text-sm text-[color:var(--ink-soft)] text-center">
        Already have an account? <Link href="/login" className="text-[color:var(--ink)] underline-offset-4 hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}

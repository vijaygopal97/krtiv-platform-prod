'use client';

import { useState, type FormEvent } from 'react';
import { ScrollReveal } from '@/components/krtiv/ScrollReveal';
import { getApiBase } from '@/lib/basePath';

const CATEGORIES = [
  'Photography',
  'Short Video',
  'Travel Story',
  'Heritage & Culture',
  'Food & Festivals',
];

const MAX_PHOTO_MB = 8;
const MAX_VIDEO_MB = 50;
const ACCEPT_PHOTO = 'image/jpeg,image/png,image/webp';
const ACCEPT_VIDEO = 'video/mp4,video/webm,video/quicktime';

type FormState = {
  fullName: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  gender: string;
  city: string;
  state: string;
  contestCategory: string;
  caption: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
};

const initial: FormState = {
  fullName: '',
  email: '',
  mobile: '',
  dateOfBirth: '',
  gender: '',
  city: '',
  state: 'Maharashtra',
  contestCategory: '',
  caption: '',
  termsAccepted: false,
  privacyAccepted: false,
};

function validateFile(file: File | null, maxMb: number, kind: 'photo' | 'video'): string | null {
  if (!file) return kind === 'photo' ? 'Please upload a photo.' : null;
  if (file.size > maxMb * 1024 * 1024) return `File must be under ${maxMb} MB.`;
  return null;
}

export function ContestRegistrationForm() {
  const [form, setForm] = useState(initial);
  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (key: keyof FormState, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email.';
    if (!/^[6-9]\d{9}$/.test(form.mobile.replace(/\D/g, ''))) next.mobile = 'Enter a valid 10-digit mobile number.';
    if (!form.dateOfBirth) next.dateOfBirth = 'Date of birth is required.';
    if (!form.gender) next.gender = 'Please select gender.';
    if (!form.city.trim()) next.city = 'City is required.';
    if (!form.state.trim()) next.state = 'State is required.';
    if (!form.contestCategory) next.contestCategory = 'Select a contest category.';
    const photoErr = validateFile(photo, MAX_PHOTO_MB, 'photo');
    if (photoErr) next.photo = photoErr;
    const videoErr = video ? validateFile(video, MAX_VIDEO_MB, 'video') : null;
    if (videoErr) next.video = videoErr;
    if (!form.caption.trim()) next.caption = 'Caption or description is required.';
    if (!form.termsAccepted) next.termsAccepted = 'You must accept the terms.';
    if (!form.privacyAccepted) next.privacyAccepted = 'You must accept the privacy policy.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => body.append(k, String(v)));
      if (photo) body.append('photo', photo);
      if (video) body.append('video', video);
      const res = await fetch(`${getApiBase()}/contest-registration`, { method: 'POST', body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setServerError(data.error ?? 'Submission failed. Please try again.');
        return;
      }
      setSuccess(true);
      setForm(initial);
      setPhoto(null);
      setVideo(null);
    } catch {
      setServerError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <ScrollReveal>
        <div
          className="bg-white rounded-[20px] border hairline p-8 md:p-12 text-center max-w-xl mx-auto"
          role="status"
        >
          <p className="text-4xl mb-4" aria-hidden>
            ✓
          </p>
          <h2 className="display-md">Registration received</h2>
          <p className="lede mt-4">
            Thank you for entering the Maharashtra Tourism contest. We will contact you at the email you provided.
          </p>
          <button
            type="button"
            className="mt-8 h-12 px-6 rounded-full bg-[color:var(--ink)] text-white text-sm"
            onClick={() => setSuccess(false)}
          >
            Submit another entry
          </button>
        </div>
      </ScrollReveal>
    );
  }

  const fieldClass = (name: string) =>
    `w-full min-h-[48px] px-4 rounded-xl bg-[color:var(--ivory)] border hairline outline-none focus:border-[color:var(--ink)] transition ${
      errors[name] ? 'border-red-400' : ''
    }`;

  return (
    <ScrollReveal>
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-[20px] border hairline p-6 sm:p-8 md:p-10 space-y-8"
        noValidate
      >
        {serverError && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3" role="alert">
            {serverError}
          </p>
        )}

        <fieldset className="space-y-5">
          <legend className="font-display text-lg mb-2">Personal information</legend>
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="block sm:col-span-2">
              <span className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">Full name</span>
              <input
                type="text"
                autoComplete="name"
                className={fieldClass('fullName')}
                value={form.fullName}
                onChange={(e) => set('fullName', e.target.value)}
              />
              {errors.fullName && <span className="text-xs text-red-600 mt-1 block">{errors.fullName}</span>}
            </label>
            <label className="block">
              <span className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">Email</span>
              <input
                type="email"
                autoComplete="email"
                className={fieldClass('email')}
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
              />
              {errors.email && <span className="text-xs text-red-600 mt-1 block">{errors.email}</span>}
            </label>
            <label className="block">
              <span className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">Mobile number</span>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                className={fieldClass('mobile')}
                value={form.mobile}
                onChange={(e) => set('mobile', e.target.value)}
              />
              {errors.mobile && <span className="text-xs text-red-600 mt-1 block">{errors.mobile}</span>}
            </label>
            <label className="block">
              <span className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">Date of birth</span>
              <input
                type="date"
                className={fieldClass('dateOfBirth')}
                value={form.dateOfBirth}
                onChange={(e) => set('dateOfBirth', e.target.value)}
              />
              {errors.dateOfBirth && <span className="text-xs text-red-600 mt-1 block">{errors.dateOfBirth}</span>}
            </label>
            <label className="block">
              <span className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">Gender</span>
              <select
                className={fieldClass('gender')}
                value={form.gender}
                onChange={(e) => set('gender', e.target.value)}
              >
                <option value="">Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
              {errors.gender && <span className="text-xs text-red-600 mt-1 block">{errors.gender}</span>}
            </label>
            <label className="block">
              <span className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">City</span>
              <input
                type="text"
                className={fieldClass('city')}
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
              />
              {errors.city && <span className="text-xs text-red-600 mt-1 block">{errors.city}</span>}
            </label>
            <label className="block">
              <span className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">State</span>
              <input
                type="text"
                className={fieldClass('state')}
                value={form.state}
                onChange={(e) => set('state', e.target.value)}
              />
              {errors.state && <span className="text-xs text-red-600 mt-1 block">{errors.state}</span>}
            </label>
          </div>
        </fieldset>

        <fieldset className="space-y-5">
          <legend className="font-display text-lg mb-2">Contest information</legend>
          <label className="block">
            <span className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">Contest category</span>
            <select
              className={fieldClass('contestCategory')}
              value={form.contestCategory}
              onChange={(e) => set('contestCategory', e.target.value)}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.contestCategory && (
              <span className="text-xs text-red-600 mt-1 block">{errors.contestCategory}</span>
            )}
          </label>
          <label className="block">
            <span className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">
              Upload photo (max {MAX_PHOTO_MB} MB)
            </span>
            <input
              type="file"
              accept={ACCEPT_PHOTO}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[color:var(--bone)] file:text-[color:var(--ink)]"
              onChange={(e) => {
                setPhoto(e.target.files?.[0] ?? null);
                setErrors((err) => {
                  const n = { ...err };
                  delete n.photo;
                  return n;
                });
              }}
            />
            {errors.photo && <span className="text-xs text-red-600 mt-1 block">{errors.photo}</span>}
          </label>
          <label className="block">
            <span className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">
              Upload video (optional, max {MAX_VIDEO_MB} MB)
            </span>
            <input
              type="file"
              accept={ACCEPT_VIDEO}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[color:var(--bone)] file:text-[color:var(--ink)]"
              onChange={(e) => {
                setVideo(e.target.files?.[0] ?? null);
                setErrors((err) => {
                  const n = { ...err };
                  delete n.video;
                  return n;
                });
              }}
            />
            {errors.video && <span className="text-xs text-red-600 mt-1 block">{errors.video}</span>}
          </label>
          <label className="block">
            <span className="block text-xs tracking-wide text-[color:var(--ink-soft)] mb-2">Caption / description</span>
            <textarea
              rows={4}
              className={`${fieldClass('caption')} min-h-[120px] py-3 resize-y`}
              value={form.caption}
              onChange={(e) => set('caption', e.target.value)}
            />
            {errors.caption && <span className="text-xs text-red-600 mt-1 block">{errors.caption}</span>}
          </label>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="sr-only">Agreements</legend>
          <label className="flex gap-3 items-start text-sm cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 shrink-0"
              checked={form.termsAccepted}
              onChange={(e) => set('termsAccepted', e.target.checked)}
            />
            <span>I agree to the Terms &amp; Conditions</span>
          </label>
          {errors.termsAccepted && <span className="text-xs text-red-600 block">{errors.termsAccepted}</span>}
          <label className="flex gap-3 items-start text-sm cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 shrink-0"
              checked={form.privacyAccepted}
              onChange={(e) => set('privacyAccepted', e.target.checked)}
            />
            <span>I agree to the Privacy Policy</span>
          </label>
          {errors.privacyAccepted && <span className="text-xs text-red-600 block">{errors.privacyAccepted}</span>}
        </fieldset>

        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] h-12 px-8 rounded-full bg-[color:var(--ink)] text-white text-sm disabled:opacity-60"
        >
          {submitting ? 'Submitting…' : 'Register / Submit'}
        </button>
      </form>
    </ScrollReveal>
  );
}

'use server';

import { cookies } from 'next/headers';
import { PREFERRED_LANG_COOKIE } from '@/lib/geo';
import type { VideoLanguage } from '@/lib/geo';

const VALID: VideoLanguage[] = ['en', 'hi', 'mr', 'te', 'ta', 'kn', 'gu', 'bn'];

export async function setPreferredLangCookie(lang: string) {
  if (!VALID.includes(lang as VideoLanguage)) return;
  const c = await cookies();
  c.set(PREFERRED_LANG_COOKIE, lang, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}

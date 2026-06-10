'use client';

import { useEffect } from 'react';
import { setPreferredLangCookie } from '@/app/actions';

interface PersistPreferredLangProps {
  lang: string;
  /** Only persist when language was resolved from geo/headers (not from cookie). */
  shouldPersist: boolean;
}

export default function PersistPreferredLang({ lang, shouldPersist }: PersistPreferredLangProps) {
  useEffect(() => {
    if (!shouldPersist) return;
    setPreferredLangCookie(lang);
  }, [lang, shouldPersist]);
  return null;
}

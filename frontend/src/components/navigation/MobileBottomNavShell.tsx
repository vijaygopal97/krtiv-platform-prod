'use client';

import { useEffect } from 'react';
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav';

export function MobileBottomNavShell() {
  useEffect(() => {
    document.body.classList.add('has-mobile-bottom-nav');
    return () => document.body.classList.remove('has-mobile-bottom-nav');
  }, []);

  return <MobileBottomNav />;
}

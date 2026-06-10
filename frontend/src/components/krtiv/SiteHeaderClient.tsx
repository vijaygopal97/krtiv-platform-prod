'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { SiteHeader } from '@/components/krtiv/SiteHeader';

export function SiteHeaderClient({
  variant = 'auto',
}: {
  variant?: 'auto' | 'solid';
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  return <SiteHeader variant={variant} isAuthenticated={isAuthenticated} />;
}

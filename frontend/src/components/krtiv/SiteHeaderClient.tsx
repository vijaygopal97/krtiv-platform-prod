'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, type User } from '@/services/authService';
import { SiteHeader } from '@/components/krtiv/SiteHeader';

export function SiteHeaderClient({
  variant = 'auto',
}: {
  variant?: 'auto' | 'solid';
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const sessionUser = await authService.refreshSession();
      if (!cancelled) {
        setUser(sessionUser);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = useCallback(() => {
    authService.logout();
    setUser(null);
    router.push('/');
    router.refresh();
  }, [router]);

  if (!ready) {
    return <SiteHeader variant={variant} isAuthenticated={false} isAdmin={false} />;
  }

  return (
    <SiteHeader
      variant={variant}
      isAuthenticated={!!user}
      isAdmin={user?.role === 'admin'}
      userName={user?.name}
      profilePicture={user?.profilePicture}
      onLogout={user ? handleLogout : undefined}
    />
  );
}

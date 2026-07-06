'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, type User } from '@/services/authService';
import { SiteHeader } from '@/components/krtiv/SiteHeader';
import { useCmsOptional } from '@/components/cms/CmsContext';

export function SiteHeaderClient({
  variant = 'auto',
}: {
  variant?: 'auto' | 'solid';
}) {
  const router = useRouter();
  const cms = useCmsOptional();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const sessionUser = await authService.refreshSession();
      if (!cancelled) {
        setUser(sessionUser);
        cms?.registerEditorUser(sessionUser);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [cms]);

  const handleLogout = useCallback(() => {
    authService.logout();
    setUser(null);
    cms?.registerEditorUser(null);
    cms?.setEditMode(false);
    router.push('/');
    router.refresh();
  }, [router, cms]);

  if (!ready) {
    return <SiteHeader variant={variant} isAuthenticated={false} isAdmin={false} isContentEditor={false} />;
  }

  return (
    <SiteHeader
      variant={variant}
      isAuthenticated={!!user}
      isAdmin={authService.isAdmin()}
      isContentEditor={authService.isContentEditor()}
      userName={user?.name}
      profilePicture={user?.profilePicture}
      onLogout={user ? handleLogout : undefined}
    />
  );
}

'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type MobileNavContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openMenu: () => void;
  closeMenu: () => void;
};

const MobileNavContext = createContext<MobileNavContextValue | null>(null);

export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openMenu = useCallback(() => setOpen(true), []);
  const closeMenu = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open, setOpen, openMenu, closeMenu }), [open, openMenu, closeMenu]);

  return <MobileNavContext.Provider value={value}>{children}</MobileNavContext.Provider>;
}

export function useMobileNav() {
  const ctx = useContext(MobileNavContext);
  if (!ctx) {
    throw new Error('useMobileNav must be used within MobileNavProvider');
  }
  return ctx;
}

/** Optional hook when provider may be absent (defensive). */
export function useMobileNavOptional() {
  return useContext(MobileNavContext);
}

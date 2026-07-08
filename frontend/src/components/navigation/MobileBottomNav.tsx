'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Compass, Home, Menu, User } from 'lucide-react';
import { authService } from '@/services/authService';
import { EXPLORE_PHOTOS_HREF } from '@/lib/siteNavigation';
import { useMobileNav } from '@/components/navigation/MobileNavContext';

function isHomeActive(pathname: string) {
  return pathname === '/';
}

function isExploreActive(pathname: string) {
  return pathname === '/explore' || pathname.startsWith('/explore/');
}

function isAccountActive(pathname: string) {
  return (
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/') ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password'
  );
}

export function MobileBottomNav() {
  const pathname = usePathname() ?? '/';
  const { openMenu } = useMobileNav();
  const [accountHref, setAccountHref] = useState('/login?next=/dashboard');

  useEffect(() => {
    const sync = () => {
      setAccountHref(authService.getCurrentUser()?.token ? '/dashboard' : '/login?next=/dashboard');
    };
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [pathname]);

  const tabs = [
    { id: 'home', label: 'Home', href: '/', icon: Home, active: isHomeActive(pathname) },
    { id: 'explore', label: 'Explore', href: EXPLORE_PHOTOS_HREF, icon: Compass, active: isExploreActive(pathname) },
    { id: 'account', label: 'Account', href: accountHref, icon: User, active: isAccountActive(pathname) },
  ] as const;

  return (
    <nav className="mobile-bottom-nav" aria-label="Primary mobile">
      <div className="mobile-bottom-nav__bar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`mobile-bottom-nav__item${tab.active ? ' mobile-bottom-nav__item--active' : ''}`}
              aria-current={tab.active ? 'page' : undefined}
            >
              <Icon className="mobile-bottom-nav__icon" strokeWidth={tab.active ? 2.25 : 1.75} />
              <span className="mobile-bottom-nav__label">{tab.label}</span>
            </Link>
          );
        })}
        <button type="button" className="mobile-bottom-nav__item" onClick={openMenu} aria-label="Open menu">
          <Menu className="mobile-bottom-nav__icon" strokeWidth={1.75} />
          <span className="mobile-bottom-nav__label">Menu</span>
        </button>
      </div>
    </nav>
  );
}

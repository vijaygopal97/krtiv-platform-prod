'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Map,
  Moon,
  Search,
  Sparkles,
  Sun,
  User,
} from 'lucide-react';
import { krtivLogo } from '@/lib/krtivPaths';
import type { User as AuthUser } from '@/services/authService';

export type DashboardTab =
  | 'home'
  | 'smart'
  | 'builder'
  | 'saved'
  | 'favorites'
  | 'profile'
  | 'stats';

type Props = {
  user: AuthUser;
  tab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  dark: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
};

const NAV: { id: DashboardTab | 'external'; label: string; href?: string }[] = [
  { id: 'home', label: 'Dashboard' },
  { id: 'external', label: 'Explore', href: '/explore' },
  { id: 'builder', label: 'Planner' },
  { id: 'external', label: 'Journeys', href: '/journeys/kalsubai-sunrise' },
  { id: 'saved', label: 'Saved' },
  { id: 'favorites', label: 'Favorites' },
];

export function DashboardNavbar({ user, tab, onTabChange, dark, onToggleDark, onLogout }: Props) {
  const router = useRouter();

  return (
    <header className="lux-nav-glass sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-16 md:h-[4.25rem] flex items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Home">
          <img src={krtivLogo()} alt="" className="w-11 h-11 md:w-12 md:h-12 object-contain" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Dashboard">
          {NAV.map((item) => {
            if (item.href) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 text-sm text-[color:var(--lux-muted)] hover:text-[color:var(--lux-text)] rounded-full transition-colors"
                >
                  {item.label}
                </Link>
              );
            }
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id as DashboardTab)}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  active
                    ? 'bg-[color:var(--lux-primary)] text-white font-medium'
                    : 'text-[color:var(--lux-muted)] hover:text-[color:var(--lux-text)] hover:bg-[color:var(--lux-secondary)]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          {user.role === 'admin' && (
            <button
              type="button"
              onClick={() => onTabChange('stats')}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                tab === 'stats'
                  ? 'bg-[color:var(--lux-primary)] text-white'
                  : 'text-[color:var(--lux-muted)] hover:text-[color:var(--lux-text)]'
              }`}
            >
              Stats
            </button>
          )}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-[color:var(--lux-secondary)] text-[color:var(--lux-muted)]"
            aria-label="Search"
            onClick={() => onTabChange('home')}
          >
            <Search className="w-[18px] h-[18px]" />
          </button>
          <button
            type="button"
            className="w-10 h-10 hidden sm:inline-flex items-center justify-center rounded-full hover:bg-[color:var(--lux-secondary)] text-[color:var(--lux-muted)]"
            aria-label="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />
          </button>
          <button
            type="button"
            onClick={onToggleDark}
            className="w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-[color:var(--lux-secondary)] text-[color:var(--lux-muted)]"
            aria-label={dark ? 'Light mode' : 'Dark mode'}
          >
            {dark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          </button>

          <div className="relative group ml-1">
            <button
              type="button"
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-[color:var(--lux-secondary)]"
              onClick={() => onTabChange('profile')}
            >
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="" className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <span className="w-9 h-9 rounded-full bg-[color:var(--lux-primary)] text-white inline-flex items-center justify-center">
                  <User className="w-4 h-4" />
                </span>
              )}
              <ChevronDown className="w-4 h-4 text-[color:var(--lux-muted)] hidden sm:block" />
            </button>
            <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 transition-all">
              <div className="lux-card py-2 min-w-[200px] shadow-lg">
                <p className="px-4 py-2 text-sm font-medium truncate">{user.name}</p>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm hover:bg-[color:var(--lux-secondary)] flex items-center gap-2"
                  onClick={() => onTabChange('profile')}
                >
                  <User className="w-4 h-4" /> Profile
                </button>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm hover:bg-[color:var(--lux-secondary)] flex items-center gap-2"
                  onClick={() => onTabChange('smart')}
                >
                  <Sparkles className="w-4 h-4" /> Smart tags
                </button>
                {user.role === 'admin' && (
                  <Link
                    href="/admin/hero"
                    className="block px-4 py-2 text-sm hover:bg-[color:var(--lux-secondary)]"
                  >
                    Hero CMS
                  </Link>
                )}
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  onClick={onLogout}
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="lg:hidden w-10 h-10 inline-flex items-center justify-center rounded-full bg-[color:var(--lux-secondary)]"
            aria-label="Menu"
            onClick={() => router.push('/dashboard?tab=profile')}
          >
            <LayoutDashboard className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      <nav className="lg:hidden flex gap-1 overflow-x-auto lux-hide-scrollbar px-4 pb-3" aria-label="Mobile">
        {NAV.map((item) =>
          item.href ? (
            <Link key={item.label} href={item.href} className="lux-chip shrink-0">
              {item.label}
            </Link>
          ) : (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id as DashboardTab)}
              className={`lux-chip shrink-0 ${tab === item.id ? 'lux-chip--active' : ''}`}
            >
              {item.label}
            </button>
          )
        )}
      </nav>
    </header>
  );
}

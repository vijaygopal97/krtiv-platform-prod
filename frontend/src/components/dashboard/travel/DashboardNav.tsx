'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, ChevronDown, LogOut, Menu, Search, Settings, X } from 'lucide-react';
import { krtivLogo } from '@/lib/krtivPaths';
import { authService, type User } from '@/services/authService';

export type DashTab = 'home' | 'smart' | 'builder' | 'saved' | 'saved-places' | 'favorites' | 'profile' | 'stats';

type Props = {
  user: User;
  activeTab: DashTab;
  onTabChange: (tab: DashTab) => void;
  onLogout: () => void;
  onSearch?: (query: string) => void;
};

const NAV: { label: string; tab?: DashTab; href?: string }[] = [
  { label: 'Dashboard', tab: 'home' },
  { label: 'Planner', tab: 'builder' },
  { label: 'My Trips', tab: 'saved' },
  { label: 'Saved Places', tab: 'saved-places' },
];

export default function DashboardNav({ user, activeTab, onTabChange, onLogout, onSearch }: Props) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');

  const submitSearch = () => {
    const q = searchQ.trim();
    if (q && onSearch) onSearch(q);
    else if (q) window.location.href = `/explore?q=${encodeURIComponent(q)}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Home">
          <img src={krtivLogo()} alt="" className="h-10 w-10 object-contain" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {NAV.map((item) => {
            const active = item.tab ? activeTab === item.tab : false;
            if (item.href) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1F2937] rounded-xl transition-colors duration-250"
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => item.tab && onTabChange(item.tab)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-250 ${
                  active ? 'text-[#C46B2D] bg-[#C46B2D]/10' : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8F9FB]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <div className="hidden md:flex items-center gap-2 travel-dash-card px-3 h-10 w-44 lg:w-52">
            <Search className="w-4 h-4 text-[#9CA3AF] shrink-0" />
            <input
              type="search"
              placeholder="Search…"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
              className="w-full text-sm bg-transparent outline-none placeholder:text-[#9CA3AF]"
            />
          </div>
          <button type="button" className="hidden sm:grid place-items-center w-10 h-10 rounded-xl hover:bg-[#F8F9FB] transition-colors" aria-label="Notifications">
            <Bell className="w-5 h-5 text-[#6B7280]" />
          </button>
          <button
            type="button"
            className="lg:hidden w-10 h-10 grid place-items-center rounded-xl hover:bg-[#F8F9FB]"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-[#F8F9FB] transition-colors"
            >
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="" className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <span className="w-9 h-9 rounded-full bg-[#C46B2D]/15 text-[#C46B2D] text-sm font-semibold grid place-items-center">
                  {user.name?.charAt(0) || 'U'}
                </span>
              )}
              <ChevronDown className="w-4 h-4 text-[#6B7280] hidden sm:block" />
            </button>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute right-0 mt-2 w-52 travel-dash-card py-2 shadow-lg z-50"
              >
                <p className="px-4 py-2 text-xs text-[#6B7280] truncate">{user.email}</p>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    onTabChange('profile');
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#F8F9FB]"
                >
                  <Settings className="w-4 h-4" /> Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    onTabChange('smart');
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#F8F9FB]"
                >
                  Smart tags
                </button>
                {authService.isAdmin() && (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      onTabChange('stats');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#F8F9FB]"
                  >
                    Admin stats
                  </button>
                )}
                <button type="button" onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <motion.nav
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="lg:hidden border-t border-[#E5E7EB] px-4 py-3 flex flex-col gap-1 bg-white"
        >
          {NAV.map((item) =>
            item.href ? (
              <Link key={item.label} href={item.href} className="px-3 py-2.5 text-sm rounded-xl hover:bg-[#F8F9FB]" onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  if (item.tab) onTabChange(item.tab);
                  setMobileOpen(false);
                }}
                className="px-3 py-2.5 text-left text-sm rounded-xl hover:bg-[#F8F9FB]"
              >
                {item.label}
              </button>
            ),
          )}
        </motion.nav>
      )}
    </header>
  );
}

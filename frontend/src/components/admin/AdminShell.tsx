'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiteHeaderClient } from '@/components/krtiv/SiteHeaderClient';

const NAV = [
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/hero', label: 'Hero CMS' },
  { href: '/admin/content', label: 'Inline CMS' },
];

export function AdminShell({
  title,
  eyebrow = 'Admin',
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[color:var(--ivory)] text-[color:var(--ink)] flex flex-col">
      <div className="relative z-[60] shrink-0">
        <SiteHeaderClient variant="solid" />
      </div>
      {/* Reserve space for fixed SiteHeader */}
      <div className="shrink-0" style={{ height: 'var(--site-header-height, 4rem)' }} aria-hidden />

      <div className="relative z-0 flex flex-1 flex-col lg:flex-row max-w-[1400px] w-full mx-auto px-4 md:px-8 pb-10 pt-4 md:pt-6 gap-8">
        <aside className="lg:w-52 shrink-0 lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow text-[color:var(--saffron)]">{eyebrow}</p>
          <h1 className="font-display text-2xl mt-1 mb-6">{title}</h1>
          <nav className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar" aria-label="Admin">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium border transition ${
                    active
                      ? 'bg-[color:var(--ink)] text-white border-transparent'
                      : 'bg-white border hairline hover:bg-[color:var(--bone)]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="flex-1 min-w-0 relative">{children}</div>
      </div>
    </div>
  );
}

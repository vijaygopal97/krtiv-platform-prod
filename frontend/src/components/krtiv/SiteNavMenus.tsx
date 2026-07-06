'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  CURATED_ITINERARIES_HREF,
  CURATED_ITINERARIES_LABEL,
  CURATED_NAV,
  getThingsNavLinks,
  isActiveNavPath,
  isCuratedSectionActive,
  THINGS_TO_DO_HREF,
  THINGS_TO_DO_LABEL,
  type CuratedNavItem,
} from '@/lib/siteNavigation';

type NavTone = {
  textColor: string;
  linkHover: string;
};

function DesktopDropdown({
  label,
  items,
  mainHref,
  tone,
  pathname,
}: {
  label: string;
  items: { label: string; href: string }[];
  mainHref?: string;
  tone: NavTone;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnId = useId();
  const panelId = useId();
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open, close]);

  const anyChildActive = items.some((i) => isActiveNavPath(pathname, i.href));

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        id={btnId}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 min-h-[44px] px-1 transition-colors ${tone.linkHover} ${
          anyChildActive || (mainHref && isActiveNavPath(pathname, mainHref))
            ? 'text-[color:var(--saffron)]'
            : ''
        }`}
      >
        {mainHref ? (
          <Link
            href={mainHref}
            className="hover:underline underline-offset-4"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
          >
            {label}
          </Link>
        ) : (
          <span>{label}</span>
        )}
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          className={`opacity-70 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <div
        id={panelId}
        role="menu"
        aria-labelledby={btnId}
        className={`absolute left-0 top-full pt-2 z-[9999] transition-all duration-200 ease-out origin-top ${
          open ? 'opacity-100 scale-100 pointer-events-auto translate-y-0' : 'opacity-0 scale-[0.98] pointer-events-none -translate-y-1'
        }`}
      >
        <div className="site-nav-dropdown-panel min-w-[260px] overflow-y-auto overscroll-contain py-2">
          {items.map((item) => {
            const active = isActiveNavPath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                tabIndex={open ? 0 : -1}
                onClick={close}
                className={`site-nav-dropdown-item block px-4 py-3 min-h-[44px] flex items-center ${
                  active ? 'site-nav-dropdown-item--active' : ''
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CuratedNavRow({
  item,
  pathname,
  onClose,
  open,
}: {
  item: CuratedNavItem;
  pathname: string;
  onClose: () => void;
  open: boolean;
}) {
  const [subOpen, setSubOpen] = useState(false);
  const hasChildren = Boolean(item.children?.length);
  const rowActive =
    isActiveNavPath(pathname, item.href) ||
    item.children?.some((c) => isActiveNavPath(pathname, c.href));

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        role="menuitem"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={`site-nav-dropdown-item block px-4 py-3 min-h-[44px] ${
          rowActive ? 'site-nav-dropdown-item--active' : ''
        }`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="site-nav-dropdown-nested"
      onMouseEnter={() => setSubOpen(true)}
      onMouseLeave={() => setSubOpen(false)}
    >
      <div className="flex items-stretch">
        <Link
          href={item.href}
          role="menuitem"
          tabIndex={open ? 0 : -1}
          onClick={onClose}
          className={`site-nav-dropdown-item flex-1 px-4 py-3 min-h-[44px] flex flex-col justify-center ${
            rowActive ? 'site-nav-dropdown-item--active' : ''
          }`}
        >
          <span>{item.label}</span>
        </Link>
        <button
          type="button"
          aria-label={`Show ${item.label} destinations`}
          aria-expanded={subOpen}
          onClick={() => setSubOpen((v) => !v)}
          className="site-nav-dropdown-item px-3 flex items-center border-l border-black/5"
        >
          <svg width="10" height="10" viewBox="0 0 12 12" className="opacity-60" aria-hidden>
            <path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div
        className={`site-nav-dropdown-flyout transition-all duration-200 ease-out ${
          subOpen ? 'opacity-100 pointer-events-auto translate-x-0' : 'opacity-0 pointer-events-none -translate-x-1'
        }`}
        role="menu"
        aria-label={`${item.label} destinations`}
      >
        <div className="site-nav-dropdown-panel py-2 min-w-[240px]">
          {item.children!.map((child) => {
            const active = isActiveNavPath(pathname, child.href);
            return (
              <Link
                key={child.href}
                href={child.href}
                role="menuitem"
                tabIndex={subOpen ? 0 : -1}
                onClick={onClose}
                className={`site-nav-dropdown-item block px-4 py-3 ${
                  active ? 'site-nav-dropdown-item--active' : ''
                }`}
              >
                <span className="block font-medium">{child.label}</span>
                {child.detail ? (
                  <span className="block text-[12px] font-normal text-[#666] mt-0.5 leading-snug">
                    {child.detail}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CuratedItinerariesDropdown({
  tone,
  pathname,
}: {
  tone: NavTone;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnId = useId();
  const panelId = useId();
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open, close]);

  const sectionActive = isCuratedSectionActive(pathname);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        id={btnId}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 min-h-[44px] px-1 transition-colors ${tone.linkHover} ${
          sectionActive ? 'text-[color:var(--saffron)]' : ''
        }`}
      >
        <Link
          href={CURATED_ITINERARIES_HREF}
          className="hover:underline underline-offset-4"
          onClick={(e) => {
            e.stopPropagation();
            close();
          }}
        >
          {CURATED_ITINERARIES_LABEL}
        </Link>
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          className={`opacity-70 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <div
        id={panelId}
        role="menu"
        aria-labelledby={btnId}
        className={`absolute left-0 top-full pt-2 z-[9999] transition-all duration-200 ease-out origin-top ${
          open ? 'opacity-100 scale-100 pointer-events-auto translate-y-0' : 'opacity-0 scale-[0.98] pointer-events-none -translate-y-1'
        }`}
      >
        <div className="site-nav-dropdown-panel min-w-[300px] overflow-visible py-2">
          {CURATED_NAV.map((item) => (
            <CuratedNavRow key={item.slug} item={item} pathname={pathname} onClose={close} open={open} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SiteNavMenus({
  tone,
  pathname,
  mobile = false,
  onNavigate,
}: {
  tone: NavTone;
  pathname: string;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const thingsItems = getThingsNavLinks();

  if (mobile) {
    const [thingsOpen, setThingsOpen] = useState(false);
    const [curatedOpen, setCuratedOpen] = useState(false);
    const [nestedCuratedOpen, setNestedCuratedOpen] = useState<string | null>(null);
    const linkClass =
      'site-nav-dropdown-item py-3 pl-3 min-h-[44px] flex items-center border-l-2 border-transparent hover:border-[#E67E22] transition-colors text-base sm:text-[15px] rounded-r-lg';

    return (
      <div className="flex flex-col gap-1">
        <div className="border-b hairline pb-2">
          <button
            type="button"
            className="w-full flex items-center justify-between py-3 min-h-[48px] font-display text-lg"
            aria-expanded={thingsOpen}
            onClick={() => setThingsOpen((v) => !v)}
          >
            {THINGS_TO_DO_LABEL}
            <span className="text-xl leading-none w-8 text-center" aria-hidden>
              {thingsOpen ? '−' : '+'}
            </span>
          </button>
          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-out ${
              thingsOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden">
              <Link href={THINGS_TO_DO_HREF} onClick={onNavigate} className={`block ${linkClass}`}>
                Browse all circuits
              </Link>
              {thingsItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={onNavigate} className={`block ${linkClass}`}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-b hairline pb-2">
          <button
            type="button"
            className="w-full flex items-center justify-between py-3 min-h-[48px] font-display text-lg"
            aria-expanded={curatedOpen}
            onClick={() => setCuratedOpen((v) => !v)}
          >
            {CURATED_ITINERARIES_LABEL}
            <span className="text-xl leading-none w-8 text-center" aria-hidden>
              {curatedOpen ? '−' : '+'}
            </span>
          </button>
          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-out ${
              curatedOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden max-h-[480px] overflow-y-auto overscroll-contain pr-1">
              <Link href={CURATED_ITINERARIES_HREF} onClick={onNavigate} className={`block ${linkClass}`}>
                Browse all destinations
              </Link>
              {CURATED_NAV.map((item) =>
                item.children?.length ? (
                  <div key={item.slug}>
                    <button
                      type="button"
                      className={`w-full text-left ${linkClass} justify-between`}
                      aria-expanded={nestedCuratedOpen === item.slug}
                      onClick={() =>
                        setNestedCuratedOpen((prev) => (prev === item.slug ? null : item.slug))
                      }
                    >
                      <span>{item.label}</span>
                      <span aria-hidden>{nestedCuratedOpen === item.slug ? '−' : '+'}</span>
                    </button>
                    {nestedCuratedOpen === item.slug ? (
                      <div className="pl-4 border-l-2 border-[#E67E22]/30 ml-3 mb-1">
                        <Link href={item.href} onClick={onNavigate} className={`block ${linkClass} text-sm`}>
                          Overview
                        </Link>
                        {item.children.map((child) => (
                          <Link key={child.href} href={child.href} onClick={onNavigate} className={`block ${linkClass} text-sm`}>
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <Link key={item.href} href={item.href} onClick={onNavigate} className={`block ${linkClass}`}>
                    {item.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <DesktopDropdown
        label={THINGS_TO_DO_LABEL}
        mainHref={THINGS_TO_DO_HREF}
        items={thingsItems}
        tone={tone}
        pathname={pathname}
      />
      <CuratedItinerariesDropdown tone={tone} pathname={pathname} />
    </>
  );
}

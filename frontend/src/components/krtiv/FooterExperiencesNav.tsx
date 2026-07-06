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
} from '@/lib/siteNavigation';

const childLinkClass =
  'block py-2 pl-3 text-[14px] text-white/60 hover:text-white border-l border-transparent hover:border-white/25 transition-colors duration-300 ease-out focus:outline-none focus-visible:text-white focus-visible:border-[color:var(--saffron)]';

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 12 12"
      className={`shrink-0 opacity-70 transition-transform duration-300 ease-out ${open ? 'rotate-180' : ''}`}
      aria-hidden
    >
      <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FooterNavGroup({
  label,
  mainHref,
  items,
}: {
  label: string;
  mainHref: string;
  items: { label: string; href: string; children?: { label: string; href: string }[] }[];
}) {
  const [open, setOpen] = useState(false);
  const [nestedOpen, setNestedOpen] = useState<string | null>(null);
  const [hoverEnabled, setHoverEnabled] = useState(false);
  const wrapRef = useRef<HTMLLIElement>(null);
  const btnId = useId();
  const panelId = useId();
  const pathname = usePathname();
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const apply = () => setHoverEnabled(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

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

  const sectionActive =
    isActiveNavPath(pathname, mainHref) ||
    items.some(
      (i) =>
        isActiveNavPath(pathname, i.href) ||
        i.children?.some((c) => isActiveNavPath(pathname, c.href)),
    );

  return (
    <li
      ref={wrapRef}
      className="relative"
      onMouseEnter={hoverEnabled ? () => setOpen(true) : undefined}
      onMouseLeave={hoverEnabled ? () => setOpen(false) : undefined}
    >
      <button
        type="button"
        id={btnId}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${label}, ${open ? 'collapse' : 'expand'} submenu`}
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-2 py-1 text-left text-[15px] transition-colors duration-300 ease-out focus:outline-none focus-visible:text-white ${
          sectionActive ? 'text-white' : 'text-white/75 hover:text-white'
        }`}
      >
        <span className="inline-flex items-center gap-2 min-w-0">
          <Link
            href={mainHref}
            className="hover:underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--saffron)] rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {label}
          </Link>
        </span>
        <Chevron open={open} />
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <ul
            role="menu"
            className="mt-1 mb-2 max-h-[min(360px,55vh)] overflow-y-auto overscroll-contain space-y-0.5 border-l border-white/10 ml-0.5"
          >
            {items.map((item) => {
              const active = isActiveNavPath(pathname, item.href);
              const hasChildren = Boolean(item.children?.length);
              if (!hasChildren) {
                return (
                  <li key={item.href} role="none">
                    <Link
                      href={item.href}
                      role="menuitem"
                      tabIndex={open ? 0 : -1}
                      onClick={close}
                      className={`${childLinkClass} ${active ? '!text-white !border-[color:var(--saffron)]' : ''}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
              const nestedId = item.href;
              const nestedIsOpen = nestedOpen === nestedId;
              return (
                <li key={item.href} role="none">
                  <button
                    type="button"
                    className={`${childLinkClass} w-full text-left flex items-center justify-between gap-2 ${
                      active ? '!text-white' : ''
                    }`}
                    aria-expanded={nestedIsOpen}
                    onClick={() => setNestedOpen(nestedIsOpen ? null : nestedId)}
                  >
                    <span>{item.label}</span>
                    <span aria-hidden className="text-xs">{nestedIsOpen ? '−' : '+'}</span>
                  </button>
                  {nestedIsOpen ? (
                    <ul className="ml-3 border-l border-white/10">
                      <li>
                        <Link
                          href={item.href}
                          role="menuitem"
                          onClick={close}
                          className={`${childLinkClass} text-[13px]`}
                        >
                          Overview
                        </Link>
                      </li>
                      {item.children!.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            role="menuitem"
                            onClick={close}
                            className={`${childLinkClass} text-[13px] ${
                              isActiveNavPath(pathname, child.href) ? '!text-white !border-[color:var(--saffron)]' : ''
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </li>
  );
}

/** Footer Experiences — same routes as header (`CIRCUIT_NAV`, curated trails). */
export function FooterExperiencesNav() {
  const thingsItems = getThingsNavLinks();
  const curatedItems = CURATED_NAV.map((item) => ({
    label: item.label,
    href: item.href,
    children: item.children?.map((c) => ({ label: c.label, href: c.href })),
  }));

  return (
    <ul className="mt-5 space-y-3 text-[15px]" aria-label="Experiences navigation">
      <FooterNavGroup label={THINGS_TO_DO_LABEL} mainHref={THINGS_TO_DO_HREF} items={thingsItems} />
      <FooterNavGroup label={CURATED_ITINERARIES_LABEL} mainHref={CURATED_ITINERARIES_HREF} items={curatedItems} />
    </ul>
  );
}

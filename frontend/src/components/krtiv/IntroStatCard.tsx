'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Editable } from '@/components/cms/Editable';
import type { IntroStatConfig } from '@/data/homeIntroStats';
import '@/styles/intro-stat-card.css';

type Props = {
  stat: IntroStatConfig;
  index: number;
};

export function IntroStatCard({ stat, index }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [hoverCapable, setHoverCapable] = useState(false);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const apply = () => setHoverCapable(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const clearTimers = useCallback(() => {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  const scheduleOpen = useCallback(() => {
    if (!hoverCapable) return;
    clearTimers();
    showTimer.current = setTimeout(() => setOpen(true), 100);
  }, [hoverCapable, clearTimers]);

  const scheduleClose = useCallback(() => {
    clearTimers();
    hideTimer.current = setTimeout(() => setOpen(false), 160);
  }, [clearTimers]);

  const keepOpen = useCallback(() => {
    clearTimers();
    setOpen(true);
  }, [clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const hasQuickLinks = Boolean(stat.quickLinks?.length);
  const isUnesco = stat.href.includes('/unesco');

  return (
    <div
      ref={wrapRef}
      className="intro-stat-wrap"
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
      onFocus={scheduleOpen}
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node)) scheduleClose();
      }}
    >
      <Link href={stat.href} className="intro-stat-card group" aria-describedby={hoverCapable ? `intro-stat-preview-${index}` : undefined}>
        <p className="display-md intro-stat-card__value text-[color:var(--ink)]">
          <Editable cmsKey={stat.valueKey} defaultValue={stat.value} as="span" />
          <span className="intro-stat-card__arrow text-[color:var(--saffron)]" aria-hidden>
            →
          </span>
        </p>
        <p className="mt-2 text-sm text-[color:var(--ink-soft)] tracking-wide intro-stat-card__label">
          <Editable cmsKey={stat.labelKey} defaultValue={stat.label} as="span" />
        </p>
      </Link>

      {hoverCapable ? (
        <div
          id={`intro-stat-preview-${index}`}
          role="tooltip"
          className={`intro-stat-preview ${open ? 'intro-stat-preview--open' : ''} ${isUnesco ? 'intro-stat-preview--wide' : ''}`}
          onMouseEnter={keepOpen}
          onMouseLeave={scheduleClose}
        >
          <div className="intro-stat-preview__panel">
            <div className="intro-stat-preview__media">
              <img src={stat.previewImage} alt="" loading="lazy" />
              <span className="intro-stat-preview__badge">Maharashtra</span>
            </div>
            <div className="intro-stat-preview__body">
              <p className="intro-stat-preview__title">{stat.hoverTitle}</p>
              <p className="intro-stat-preview__desc">{stat.hoverDescription}</p>
              {hasQuickLinks ? (
                <div className="intro-stat-preview__links">
                  {stat.quickLinks!.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="intro-stat-preview__link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>{link.label}</span>
                      <span aria-hidden>→</span>
                    </Link>
                  ))}
                  {isUnesco ? (
                    <Link href={stat.href} className="intro-stat-preview__link" onClick={(e) => e.stopPropagation()}>
                      <span>All seven UNESCO guides</span>
                      <span aria-hidden>→</span>
                    </Link>
                  ) : null}
                </div>
              ) : null}
              <Link href={stat.href} className="intro-stat-preview__cta" onClick={(e) => e.stopPropagation()}>
                {stat.previewCta}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
          <span className="intro-stat-preview__caret" aria-hidden />
        </div>
      ) : null}
    </div>
  );
}

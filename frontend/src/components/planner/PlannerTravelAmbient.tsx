'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePlannerAmbient } from '@/components/planner/PlannerAmbientContext';
import { usePlannerDocumentParallax } from '@/hooks/usePlannerDocumentParallax';
import {
  PLANNER_PARTICLES,
  PLANNER_TRAVEL_ICONS,
  iconIdsForInterestPulse,
} from '@/lib/plannerTravelIcons';
import { PlannerTravelIcon } from '@/components/planner/plannerTravelIconSvgs';

const ROUTE_LEFT =
  'M 8,6 C 5,28 5,52 8,74 C 10,88 12,94 14,96';
const ROUTE_RIGHT =
  'M 92,94 C 95,72 95,48 92,26 C 90,12 88,6 86,4';

type PlannerTravelAmbientProps = {
  /** Element observed for visibility / parallax (default: home planner section). */
  observeRootSelector?: string;
  /** Lower icon/route opacity for content-heavy pages (e.g. Contact). */
  subtle?: boolean;
};

export function PlannerTravelAmbient({
  observeRootSelector = '#floating-interest-bubbles',
  subtle = false,
}: PlannerTravelAmbientProps = {}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionActive, setSectionActive] = useState(false);
  const { selectedInterests, flashToken, lastFlashInterest } = usePlannerAmbient();
  const parallax = usePlannerDocumentParallax(sectionActive);

  const [pulseIds, setPulseIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const el = document.querySelector(observeRootSelector);
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setSectionActive(entry.isIntersecting && entry.intersectionRatio > 0.12),
      { threshold: [0, 0.12, 0.35] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [observeRootSelector]);

  useEffect(() => {
    if (!lastFlashInterest || flashToken === 0) return;
    const ids = new Set(iconIdsForInterestPulse(lastFlashInterest));
    if (ids.size === 0) return;
    setPulseIds(ids);
    const t = window.setTimeout(() => setPulseIds(new Set()), 1500);
    return () => window.clearTimeout(t);
  }, [flashToken, lastFlashInterest]);

  const particles = useMemo(() => PLANNER_PARTICLES, []);

  return (
    <div
      ref={sectionRef}
      className={['planner-travel-ambient', subtle ? 'planner-travel-ambient--subtle' : '']
        .filter(Boolean)
        .join(' ')}
      aria-hidden
    >
      <div className="planner-travel-vignette" />
      <div className="planner-travel-center-glow" />

      <svg className="planner-travel-route planner-travel-route--left" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="planner-travel-route__path" d={ROUTE_LEFT} fill="none" />
        <g className="planner-travel-route__pin">
          <circle r="1.4" fill="currentColor">
            <animateMotion dur="26s" repeatCount="indefinite" path={ROUTE_LEFT} />
          </circle>
        </g>
      </svg>

      <svg className="planner-travel-route planner-travel-route--right" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="planner-travel-route__path" d={ROUTE_RIGHT} fill="none" />
        <circle className="planner-travel-route__dot" r="1" fill="currentColor">
          <animateMotion dur="32s" repeatCount="indefinite" path={ROUTE_RIGHT} />
        </circle>
      </svg>

      {particles.map((p, i) => (
        <span
          key={`particle-${i}`}
          className="planner-travel-particle"
          style={{
            top: p.top,
            left: p.left,
            right: p.right,
            bottom: p.bottom,
            ['--particle-size' as string]: `${p.size}px`,
            ['--anim-delay' as string]: p.delay,
          }}
        />
      ))}

      {PLANNER_TRAVEL_ICONS.map((icon) => {
        const animClass = icon.anims.map((a) => `planner-icon--${a}`).join(' ');
        const isSelected =
          icon.categories.length > 0 && icon.categories.some((c) => selectedInterests.includes(c));
        const isPulse = pulseIds.has(icon.id);
        const tx = parallax.x * icon.depth;
        const ty = parallax.y * icon.depth;

        return (
          <div
            key={icon.id}
            className="planner-travel-icon-wrap"
            style={{
              top: icon.top,
              left: icon.left,
              right: icon.right,
              bottom: icon.bottom,
              transform: `translate3d(${tx}px, ${ty}px, 0)`,
            }}
          >
            <div
              className={[
                'planner-travel-icon',
                animClass,
                icon.showMobile ? 'planner-travel-icon--mobile' : 'planner-travel-icon--desktop-only',
                isSelected ? 'is-selected' : '',
                isPulse ? 'is-active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                ['--icon-size' as string]: `${icon.size}px`,
                ['--anim-delay' as string]: icon.delay,
                ['--float-duration' as string]: icon.duration,
              }}
            >
              <PlannerTravelIcon id={icon.id} size={icon.size} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

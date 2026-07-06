'use client';

import { useEffect, useRef, type RefObject } from 'react';

const MOVE_PX = 8;
const SCROLL_PX = 2;

export type TapGuard = {
  block: boolean;
};

/**
 * Tracks carousel + page scroll during a touch/pointer gesture so card taps
 * are suppressed while the user is scrolling (vertical or horizontal).
 */
export function useTravelStoriesTapGuard(scrollerRef: RefObject<HTMLDivElement | null>) {
  const guardRef = useRef<TapGuard>({ block: false });

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let active = false;
    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let startPageY = 0;

    const markBlocked = () => {
      guardRef.current.block = true;
      el.classList.add('is-dragging');
    };

    const resetGesture = () => {
      active = false;
      guardRef.current.block = false;
      el.classList.remove('is-dragging');
    };

    const onPointerDown = (e: PointerEvent) => {
      // Touch only — desktop trackpad/mouse scroll should not toggle drag state.
      if (e.pointerType !== 'touch') return;
      if (e.button !== 0) return;
      active = true;
      guardRef.current.block = false;
      el.classList.remove('is-dragging');
      startX = e.clientX;
      startY = e.clientY;
      startScrollLeft = el.scrollLeft;
      startPageY = window.scrollY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!active || e.pointerType !== 'touch') return;
      const adx = Math.abs(e.clientX - startX);
      const ady = Math.abs(e.clientY - startY);
      if (adx > MOVE_PX || ady > MOVE_PX) {
        markBlocked();
      }
    };

    const onScrollerScroll = () => {
      if (!active) return;
      if (Math.abs(el.scrollLeft - startScrollLeft) > SCROLL_PX) {
        markBlocked();
      }
    };

    const onPageScroll = () => {
      if (!active) return;
      if (Math.abs(window.scrollY - startPageY) > SCROLL_PX) {
        markBlocked();
      }
    };

    const onPointerUp = () => {
      if (!active) return;
      active = false;
      // Keep `block` true through the rest of this event loop so card pointerup
      // handlers can read it before we reset.
      window.setTimeout(() => {
        guardRef.current.block = false;
        el.classList.remove('is-dragging');
      }, 80);
    };

    el.addEventListener('pointerdown', onPointerDown, true);
    el.addEventListener('pointermove', onPointerMove, true);
    el.addEventListener('pointerup', onPointerUp, true);
    el.addEventListener('pointercancel', onPointerUp, true);
    el.addEventListener('scroll', onScrollerScroll, { passive: true });
    window.addEventListener('scroll', onPageScroll, { passive: true });

    return () => {
      resetGesture();
      el.removeEventListener('pointerdown', onPointerDown, true);
      el.removeEventListener('pointermove', onPointerMove, true);
      el.removeEventListener('pointerup', onPointerUp, true);
      el.removeEventListener('pointercancel', onPointerUp, true);
      el.removeEventListener('scroll', onScrollerScroll);
      window.removeEventListener('scroll', onPageScroll);
    };
  }, [scrollerRef]);

  return guardRef;
}

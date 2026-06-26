'use client';

import { useEffect, useRef, useState } from 'react';

const LERP = 0.08;

export function usePlannerDocumentParallax(sectionActive: boolean) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [multiplier, setMultiplier] = useState(1);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 768px)');
    const tablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)');
    const apply = () => {
      if (mobile.matches) setMultiplier(0);
      else if (tablet.matches) setMultiplier(0.5);
      else setMultiplier(1);
    };
    apply();
    mobile.addEventListener('change', apply);
    tablet.addEventListener('change', apply);
    return () => {
      mobile.removeEventListener('change', apply);
      tablet.removeEventListener('change', apply);
    };
  }, []);

  useEffect(() => {
    if (!sectionActive || multiplier === 0) {
      target.current = { x: 0, y: 0 };
      current.current = { x: 0, y: 0 };
      setOffset({ x: 0, y: 0 });
      return;
    }

    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      target.current = {
        x: (e.clientX - cx) * multiplier,
        y: (e.clientY - cy) * multiplier,
      };
    };

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * LERP;
      current.current.y += (target.current.y - current.current.y) * LERP;
      setOffset({ x: current.current.x, y: current.current.y });
      raf.current = requestAnimationFrame(tick);
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    raf.current = requestAnimationFrame(tick);
    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [sectionActive, multiplier]);

  return offset;
}

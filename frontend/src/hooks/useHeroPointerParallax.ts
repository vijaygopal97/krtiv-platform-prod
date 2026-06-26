"use client";

import { useEffect, useRef, useState } from "react";

export type HeroPointerOffset = { x: number; y: number };

const MAX_X = 14;
const MAX_Y = 10;
const EASE = 0.12;

export function useHeroPointerParallax(enabled: boolean): HeroPointerOffset {
  const [offset, setOffset] = useState<HeroPointerOffset>({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1024px)");
    if (reduced.matches || !desktop.matches) return;

    let rafId = 0;

    const loop = () => {
      current.current.x +=
        (target.current.x - current.current.x) * EASE;
      current.current.y +=
        (target.current.y - current.current.y) * EASE;
      setOffset({
        x: current.current.x,
        y: current.current.y,
      });
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      target.current = { x: nx * MAX_X, y: ny * MAX_Y };
    };

    const onLeave = () => {
      target.current = { x: 0, y: 0 };
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  return offset;
}

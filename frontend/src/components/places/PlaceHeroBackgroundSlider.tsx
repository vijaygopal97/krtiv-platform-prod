"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { resolveSlideImage } from "@/lib/heroSlidesApi";
import type { HeroSlideRecord } from "@/lib/heroSlideTypes";

const ROTATION_MS = 4500;
const FADE_MS = 900;
const RESUME_AFTER_MS = 8000;

type Props = {
  slides: HeroSlideRecord[];
  scrollY: number;
};

export function PlaceHeroBackgroundSlider({ slides, scrollY }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [brokenIds, setBrokenIds] = useState<Set<string>>(() => new Set());
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const preloaded = useRef<Set<string>>(new Set());

  const activeSlides = useMemo(() => {
    return slides.filter((s) => !brokenIds.has(s._id || s.imageUrl));
  }, [slides, brokenIds]);

  const safeIndex = activeSlides.length
    ? Math.min(index, activeSlides.length - 1)
    : 0;

  const preload = useCallback((url: string) => {
    if (preloaded.current.has(url)) return;
    preloaded.current.add(url);
    const img = new window.Image();
    img.src = url;
  }, []);

  useEffect(() => {
    setIndex(0);
    setBrokenIds(new Set());
    preloaded.current.clear();
    slides.forEach((s, i) => {
      if (i < 3) preload(resolveSlideImage(s.imageUrl));
    });
  }, [slides, preload]);

  useEffect(() => {
    if (!activeSlides.length) return;
    const next = activeSlides[(safeIndex + 1) % activeSlides.length];
    if (next) preload(resolveSlideImage(next.imageUrl));
  }, [safeIndex, activeSlides, preload]);

  const markBroken = useCallback((slide: HeroSlideRecord) => {
    const id = slide._id || slide.imageUrl;
    setBrokenIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const goTo = useCallback(
    (i: number) => {
      if (activeSlides.length <= 1) return;
      const n = ((i % activeSlides.length) + activeSlides.length) % activeSlides.length;
      setIndex(n);
    },
    [activeSlides.length]
  );

  const pauseInteraction = useCallback(() => {
    setPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), RESUME_AFTER_MS);
  }, []);

  const next = useCallback(() => {
    goTo(safeIndex + 1);
    pauseInteraction();
  }, [goTo, safeIndex, pauseInteraction]);

  const prev = useCallback(() => {
    goTo(safeIndex - 1);
    pauseInteraction();
  }, [goTo, safeIndex, pauseInteraction]);

  useEffect(() => {
    if (index >= activeSlides.length && activeSlides.length > 0) {
      setIndex(0);
    }
  }, [index, activeSlides.length]);

  useEffect(() => {
    if (activeSlides.length <= 1 || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % activeSlides.length);
    }, ROTATION_MS);
    return () => window.clearInterval(id);
  }, [activeSlides.length, paused]);

  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  if (!activeSlides.length) return null;

  return (
    <>
      <div
        className="absolute inset-0 z-0 min-h-[100svh] will-change-transform bg-[color:var(--ink)]"
        style={{ transform: `translate3d(0, ${scrollY * 0.35}px, 0)` }}
        aria-hidden
        onTouchStart={(e) => {
          touchStartX.current = e.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current;
          const end = e.changedTouches[0]?.clientX;
          touchStartX.current = null;
          if (start == null || end == null || activeSlides.length < 2) return;
          const d = end - start;
          if (Math.abs(d) < 48) return;
          if (d < 0) next();
          else prev();
        }}
      >
        <div className="hero-bg-stack hero-bg-pointer-layer absolute inset-0 min-h-[100svh]">
          {activeSlides.map((slide, i) => {
            const isActive = i === safeIndex;
            const src = resolveSlideImage(slide.imageUrl);
            return (
              <div
                key={slide._id || src}
                className={`absolute inset-0 transition-opacity ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isActive ? "opacity-100 z-[1]" : "opacity-0 z-0 pointer-events-none"
                }`}
                style={{ transitionDuration: `${FADE_MS}ms` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className={`absolute inset-0 h-full w-full object-cover md:h-[120%] ${
                    i % 2 === 0 ? "ken-burns-a" : "ken-burns-b"
                  }`}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  onError={() => markBroken(slide)}
                />
              </div>
            );
          })}
          <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/40 via-black/15 to-black/35 md:from-black/35 md:via-black/10 md:to-black/30" />
        </div>
      </div>

      {activeSlides.length > 1 ? (
        <div className="absolute bottom-24 md:bottom-28 left-0 right-0 z-20 px-6 md:px-10 pointer-events-none">
          <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-4 pointer-events-auto">
            <button
              type="button"
              className="hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/25 text-white/90 hover:bg-black/45 transition"
              aria-label="Previous slide"
              onClick={prev}
            >
              ‹
            </button>
            <div className="flex items-center gap-2" role="tablist" aria-label="Hero slideshow">
              {activeSlides.map((s, i) => (
                <button
                  key={s._id || i}
                  type="button"
                  role="tab"
                  aria-selected={i === safeIndex}
                  aria-label={`Show image ${i + 1}: ${s.alt || s.title}`}
                  onClick={() => {
                    goTo(i);
                    pauseInteraction();
                  }}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    i === safeIndex ? "bg-[color:var(--saffron)] scale-110" : "bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              className="hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/25 text-white/90 hover:bg-black/45 transition"
              aria-label="Next slide"
              onClick={next}
            >
              ›
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

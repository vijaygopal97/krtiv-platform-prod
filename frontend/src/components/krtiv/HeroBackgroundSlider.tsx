"use client";

import { useEffect, useState } from "react";
import { resolveSlideImage, trackHeroSlide } from "@/lib/heroSlidesApi";
import type { HeroSlideRecord } from "@/lib/heroSlideTypes";
import { HeroFocalImage } from "@/components/krtiv/HeroFocalImage";

const ROTATION_MS = 6500;

type Props = {
  slides: HeroSlideRecord[];
  scrollY: number;
};

export function HeroBackgroundSlider({ slides, scrollY }: Props) {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => {
        const next = (i + 1) % slides.length;
        setPrevIndex(i);
        setIsTransitioning(true);
        window.setTimeout(() => setIsTransitioning(false), 1400);
        return next;
      });
    }, ROTATION_MS);
    return () => window.clearInterval(id);
  }, [slides.length]);

  useEffect(() => {
    const slide = slides[index];
    if (slide?._id) trackHeroSlide(slide._id, "impression");
  }, [index, slides]);

  const goTo = (i: number) => {
    if (i === index) return;
    setPrevIndex(index);
    setIndex(i);
    setIsTransitioning(true);
    window.setTimeout(() => setIsTransitioning(false), 1400);
  };

  if (!slides.length) return null;

  return (
    <>
      <div
        className="absolute inset-0 z-0 min-h-[100svh] will-change-transform"
        style={{ transform: `translate3d(0, ${scrollY * 0.35}px, 0)` }}
        aria-hidden
      >
        <div className="hero-bg-stack hero-bg-pointer-layer absolute inset-0 min-h-[100svh]">
        {slides.map((slide, i) => {
          const visible = i === index || (isTransitioning && i === prevIndex);
          const active = i === index;
          return (
            <div
              key={slide._id || `${slide.imageUrl}-${i}`}
              className={`absolute inset-0 transition-opacity duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                active ? "opacity-100 z-[1]" : visible ? "opacity-0 z-0" : "opacity-0 pointer-events-none"
              }`}
            >
              <HeroFocalImage
                src={resolveSlideImage(slide.imageUrl)}
                alt={slide.alt || ""}
                focalX={slide.focalX ?? 50}
                focalY={slide.focalY ?? 50}
                kenBurnsClass={i % 2 === 0 ? "ken-burns-a" : "ken-burns-b"}
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          );
        })}
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/30 via-black/12 to-black/38 md:from-black/22 md:via-black/8 md:to-black/28" />
        <div
          className="absolute inset-0 z-[2] opacity-30 md:opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at 30% 40%, transparent 0%, rgba(0,0,0,0.42) 80%)",
          }}
        />
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-28 md:bottom-32 left-0 right-0 z-20 px-6 md:px-10">
          <div className="max-w-[1440px] mx-auto flex items-end justify-between gap-6 border-t border-white/15 pt-4 text-white/85">
            <div className="flex flex-1 items-center gap-2 max-w-xl">
              {slides.map((s, i) => (
                <button
                  key={s._id || i}
                  type="button"
                  aria-label={`Show slide ${i + 1}: ${s.kicker || s.title}`}
                  onClick={() => goTo(i)}
                  className="group relative h-[2px] flex-1 overflow-hidden rounded-full bg-white/20 transition"
                >
                  <span
                    className="absolute inset-0 origin-left bg-[color:var(--saffron)]"
                    style={{
                      transform:
                        i < index ? "scaleX(1)" : i === index ? "scaleX(1)" : "scaleX(0)",
                      transition:
                        i === index ? `transform ${ROTATION_MS}ms linear` : "transform 600ms ease",
                    }}
                  />
                </button>
              ))}
            </div>
            <div className="hidden text-right text-xs uppercase tracking-[0.2em] sm:block">
              <div className="text-[color:var(--saffron-soft)]">
                {slides[index]?.kicker || ""}
              </div>
              <div className="mt-1 text-white/60">
                {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

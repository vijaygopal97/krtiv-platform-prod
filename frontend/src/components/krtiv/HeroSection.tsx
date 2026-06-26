"use client";

import { useEffect, useRef, useState } from "react";
import { HeroBackgroundSlider } from "./HeroBackgroundSlider";
import { HeroFocalImage } from "./HeroFocalImage";
import { HeroVideo, HeroVideoSoundToggle, type HeroVideoHandle } from "./HeroVideo";
import {
  CategoryHeroAmbience,
  isPremiumCategoryHeroTheme,
} from "./CategoryHeroAmbience";
import { ThemeAnimationLayer, type HeroThemeKey } from "./ThemeAnimationLayer";
import { CategoryHeroSkyCanvas } from "./CategoryHeroSkyCanvas";
import { isCategoryHeroAmbientTheme } from "@/lib/categoryHeroSky";
import { useHeroPointerParallax } from "@/hooks/useHeroPointerParallax";
import { usePageHeroVideo } from "@/hooks/usePageHeroVideo";
import type { HeroSlideRecord } from "@/lib/heroSlideTypes";
import { resolveSlideImage } from "@/lib/heroSlidesApi";
import { LuxuryHeroHeading } from "@/components/krtiv/LuxuryHeroHeading";
import { RotatingLuxuryHeroHeading } from "@/components/krtiv/RotatingLuxuryHeroHeading";

type HeroProps = {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  heroLedeClassName?: string;
  image: string;
  slides?: HeroSlideRecord[];
  showThemeAnimation?: boolean;
  themeAnimationTheme?: HeroThemeKey;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  /** Route scope for background video (home, explore, category slug). */
  pageVideoScope?: string;
  /** When set, replaces title with "You will find {highlight} here" luxury heading. */
  luxuryHighlight?: string;
  luxuryHeadingCentered?: boolean;
  /** Circuit pages: alternate keyword with India. */
  luxuryHighlightRotate?: boolean;
  /**
   * Home-only: pin the background while the hero copy scrolls up and fades,
   * revealing the clean background as a second hero beat. Opt-in so other
   * pages keep their existing (non-pinned) hero behavior.
   */
  pinnedReveal?: boolean;
  children?: React.ReactNode;
};

export function HeroSection({
  eyebrow = "Maharashtra",
  title,
  titleAccent,
  subtitle,
  heroLedeClassName,
  image,
  primaryHref = "/#itinerary-generator",
  primaryLabel = "Plan with AI",
  secondaryHref = "/#explore-by-categories",
  secondaryLabel = "Explore the state",
  children,
  slides,
  pageVideoScope,
  luxuryHighlight,
  luxuryHeadingCentered = false,
  luxuryHighlightRotate = false,
  showThemeAnimation = false,
  themeAnimationTheme = "home",
  pinnedReveal = false,
}: HeroProps) {
  const [y, setY] = useState(0);
  const [pin, setPin] = useState({ scrolled: 0, progress: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const heroVideoRef = useRef<HeroVideoHandle>(null);

  const categoryAmbientHero =
    showThemeAnimation && isCategoryHeroAmbientTheme(themeAnimationTheme);
  const premiumCategoryHero =
    showThemeAnimation && isPremiumCategoryHeroTheme(themeAnimationTheme);
  const layoutCategoryHero = premiumCategoryHero || categoryAmbientHero;
  const pointer = useHeroPointerParallax(layoutCategoryHero);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !layoutCategoryHero) return;
    el.style.setProperty("--hero-px", `${pointer.x}px`);
    el.style.setProperty("--hero-py", `${pointer.y}px`);
  }, [pointer.x, pointer.y, layoutCategoryHero]);

  const bgImage =
    slides?.[0] ? resolveSlideImage(slides[0].imageUrl) : image;

  const pageVideo = usePageHeroVideo(pageVideoScope, bgImage);

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      setY(window.scrollY);
      if (pinnedReveal && sectionRef.current) {
        const top = sectionRef.current.getBoundingClientRect().top;
        const vh = window.innerHeight || 1;
        const scrolled = Math.min(Math.max(-top, 0), vh);
        setPin((prev) =>
          prev.scrolled === scrolled
            ? prev
            : { scrolled, progress: scrolled / vh }
        );
      }
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinnedReveal]);

  const scopedHero = Boolean(pageVideoScope);
  const useBackgroundVideo =
    pageVideo.ready && scopedHero && Boolean(pageVideo.videoSrc);
  const useSlider =
    Boolean(slides && slides.length > 0) && !scopedHero && !useBackgroundVideo;
  const posterWhileLoading = scopedHero && !pageVideo.ready ? pageVideo.poster : pageVideo.poster;

  // In pinned mode the background must stay perfectly still (no parallax).
  const bgScrollY = pinnedReveal ? 0 : y;

  const contentStyle: React.CSSProperties = pinnedReveal
    ? {
        opacity: Math.max(0, 1 - pin.progress * 1.15),
        transform: `translate3d(0, ${-pin.scrolled}px, 0)`,
        pointerEvents: pin.progress > 0.9 ? "none" : undefined,
      }
    : {
        opacity: Math.max(0, 1 - y / 520),
        transform: `translate3d(0, ${-Math.min(y * 0.45, 120)}px, 0)`,
      };

  const stage = (
    <>
      {useBackgroundVideo ? (
        <HeroVideo
          ref={heroVideoRef}
          src={pageVideo.videoSrc!}
          poster={pageVideo.poster}
          scrollY={bgScrollY}
        />
      ) : scopedHero && pageVideo.ready && !pageVideo.videoSrc ? (
        <div
          className="absolute inset-0 z-0 min-h-[100svh]"
          style={{ transform: `translate3d(0, ${bgScrollY * 0.35}px, 0)` }}
          aria-hidden
        >
          <img src={pageVideo.poster} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/22 to-black/40 md:from-black/45 md:via-black/18 md:to-black/35" />
        </div>
      ) : scopedHero && !pageVideo.ready ? (
        <div className="absolute inset-0 z-0 min-h-[100svh]" aria-hidden>
          <img src={posterWhileLoading} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/30" />
        </div>
      ) : useSlider ? (
        <HeroBackgroundSlider slides={slides!} scrollY={bgScrollY} />
      ) : (
        <div
          className="absolute inset-0 z-0 min-h-[100svh] will-change-transform"
          style={{ transform: `translate3d(0, ${bgScrollY * 0.35}px, 0)` }}
          aria-hidden
        >
          <div className="hero-bg-stack hero-bg-pointer-layer absolute inset-0 min-h-[100svh]">
            <HeroFocalImage
              src={image}
              alt=""
              focalX={50}
              focalY={42}
              kenBurnsClass="ken-burns"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/35 md:from-black/35 md:via-black/10 md:to-black/30" />
          </div>
        </div>
      )}

      {useBackgroundVideo ? (
        <HeroVideoSoundToggle
          controlRef={heroVideoRef}
          className="absolute bottom-28 right-4 md:bottom-12 md:right-10 z-20 pointer-events-auto"
        />
      ) : null}

      {showThemeAnimation && (
        <>
          <CategoryHeroAmbience theme={themeAnimationTheme} />
          {categoryAmbientHero ? (
            <CategoryHeroSkyCanvas theme={themeAnimationTheme} />
          ) : (
            <ThemeAnimationLayer theme={themeAnimationTheme} />
          )}
        </>
      )}

      <div
        className={`relative z-10 min-h-[100svh] flex flex-col ${
          pinnedReveal
            ? "will-change-transform"
            : "transition-[opacity,transform] duration-500 ease-out"
        }`}
        style={contentStyle}
      >
        <div className="flex-1 flex items-center">
          <div
            className={`max-w-[1440px] w-full mx-auto px-6 md:px-10 pb-24 md:pb-32 hero-content-offset ${
              layoutCategoryHero ? "category-hero-inner" : ""
            } ${luxuryHighlight ? "flex flex-col items-center text-center" : ""}`}
          >
            <div
              className={`${luxuryHighlight ? "w-full max-w-4xl mx-auto flex flex-col items-center" : "max-w-3xl"}`}
            >
              <p
                className={`hero-eyebrow animate-[krtiv-fade_900ms_ease-out_both] ${luxuryHighlight ? "mx-auto" : ""}`}
                style={{ animationDelay: "120ms" }}
              >
                {eyebrow}
              </p>
              {luxuryHighlight ? (
                luxuryHighlightRotate ? (
                  <RotatingLuxuryHeroHeading
                    highlight={luxuryHighlight}
                    centered={luxuryHeadingCentered}
                  />
                ) : (
                  <LuxuryHeroHeading highlight={luxuryHighlight} centered={luxuryHeadingCentered} />
                )
              ) : (
                <h1
                  className="display-xl text-white mt-6 text-balance animate-[krtiv-rise_1100ms_cubic-bezier(0.22,1,0.36,1)_both]"
                  style={{ animationDelay: "200ms" }}
                >
                  {title}{" "}
                  {!useSlider && titleAccent && (
                    <span className="italic hero-title-accent">{titleAccent}</span>
                  )}
                </h1>
              )}
              {subtitle && (
                <p
                  className={`hero-lede mt-6 max-w-2xl animate-[krtiv-rise_1100ms_cubic-bezier(0.22,1,0.36,1)_both] ${
                    luxuryHighlight ? "mx-auto text-center" : ""
                  } ${heroLedeClassName ?? ""}`}
                  style={{ animationDelay: "360ms" }}
                >
                  {subtitle}
                </p>
              )}

              <div
                className={`mt-10 flex flex-wrap items-center gap-3 hero-cta-row animate-[krtiv-rise_1100ms_cubic-bezier(0.22,1,0.36,1)_both] ${
                  layoutCategoryHero ? "max-lg:flex-col max-lg:items-stretch" : ""
                } ${luxuryHighlight ? "justify-center max-lg:items-stretch" : ""}`}
                style={{ animationDelay: "520ms" }}
              >
                <a
                  href={primaryHref}
                  className={`group relative z-10 inline-flex items-center gap-2 h-12 px-6 rounded-full text-[14px] font-medium overflow-hidden transition shadow-[0_10px_30px_-10px_rgba(244,180,90,0.7)] hover:shadow-[0_14px_40px_-10px_rgba(244,180,90,0.9)] ${
                    layoutCategoryHero
                      ? "krtiv-hero-interactive-btn krtiv-hero-interactive-btn--primary"
                      : ""
                  }`}
                  style={{
                    color: "oklch(0.18 0.012 60)",
                    background:
                      "linear-gradient(135deg, #FFE6B0 0%, oklch(0.92 0.06 70) 35%, oklch(0.74 0.18 55) 100%)",
                  }}
                >
                  <span
                    aria-hidden
                    className="absolute -inset-1 rounded-full opacity-60 blur-xl pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(closest-side, rgba(234, 160, 72, 0.55), transparent)",
                    }}
                  />
                  <span
                    aria-hidden
                    className="relative inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px]"
                    style={{ background: "oklch(0.18 0.012 60)", color: "oklch(0.92 0.06 70)" }}
                  >
                    ✦
                  </span>
                  <span className="relative">{primaryLabel}</span>
                  <span aria-hidden className="relative transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </a>

                <a
                  href={secondaryHref}
                  className={`inline-flex items-center gap-2 h-12 px-6 rounded-full border border-white/30 text-white text-[14px] hover:bg-white/10 transition ${
                    layoutCategoryHero ? "krtiv-hero-interactive-btn" : ""
                  }`}
                >
                  {secondaryLabel}
                </a>
              </div>

              {children && <div className="mt-10">{children}</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <section
      ref={sectionRef}
      className={`relative bg-[color:var(--ink)] text-white ${
        pinnedReveal ? "" : "min-h-[100svh] overflow-hidden"
      } ${layoutCategoryHero ? "category-hero-section" : ""}`}
      style={pinnedReveal ? { height: "200vh" } : undefined}
    >
      {pinnedReveal ? (
        <div className="sticky top-0 h-[100svh] overflow-hidden">{stage}</div>
      ) : (
        stage
      )}
    </section>
  );
}

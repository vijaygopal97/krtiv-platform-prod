"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CATEGORIES } from "./data";

type CategoryEntry = (typeof CATEGORIES)[number];
import { ScrollReveal } from "./ScrollReveal";
import SmartKeywordItinerary from "@/components/itinerary/SmartKeywordItinerary";
import "@/styles/category-carousel-mobile.css";

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      {dir === "left" ? (
        <path
          d="M15 6l-6 6 6 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M9 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function CategoryCard({
  c,
  index,
  touchLayout,
}: {
  c: CategoryEntry;
  index: number;
  touchLayout?: boolean;
}) {
  return (
    <Link href={`/category/${c.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-[color:var(--bone)]">
        <img
          src={c.image}
          alt={c.title}
          loading={index < 2 ? "eager" : "lazy"}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between gap-3">
          <span className="text-[11px] tracking-[0.25em] uppercase text-white/85 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 truncate max-w-[85%]">
            {c.accent}
          </span>
          <span
            className={`w-9 h-9 shrink-0 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center text-[15px] transition group-hover:bg-white group-hover:text-[color:var(--ink)] ${
              touchLayout ? "category-touch-card-arrow" : ""
            }`}
          >
            →
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-display text-white text-2xl md:text-[28px] leading-tight text-balance">
            {c.title}
          </h3>
          <p className="text-white/80 text-sm mt-2 line-clamp-2">{c.short}</p>
        </div>
      </div>
    </Link>
  );
}

/** Mobile + tablet carousel (<1024px). Desktop uses the legacy rail below. */
function CategoryTouchCarousel() {
  const scroller = useRef<HTMLUListElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const root = scroller.current;
    if (!root) return;
    const slides = root.querySelectorAll<HTMLElement>("[data-category-touch-slide]");
    const clamped = Math.max(0, Math.min(index, slides.length - 1));
    const slide = slides[clamped];
    if (!slide) return;
    root.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    setActiveIndex(clamped);
  }, []);

  const scroll = (dir: 1 | -1) => {
    scrollToIndex(activeIndex + dir);
  };

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;

    const onScroll = () => {
      const items = Array.from(
        root.querySelectorAll<HTMLElement>("[data-category-touch-slide]"),
      );
      if (!items.length) return;
      const rootRect = root.getBoundingClientRect();
      const anchor = rootRect.left + rootRect.width / 2;
      let best = 0;
      let bestDist = Infinity;
      items.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const center = r.left + r.width / 2;
        const d = Math.abs(center - anchor);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActiveIndex(best);
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    return () => root.removeEventListener("scroll", onScroll);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scroll(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scroll(1);
    }
  };

  const atStart = activeIndex <= 0;
  const atEnd = activeIndex >= CATEGORIES.length - 1;

  return (
    <>
      <div className="category-touch-outer lg:hidden">
        <ul
          ref={scroller}
          role="list"
          aria-roledescription="carousel"
          aria-label="Explore Maharashtra by category"
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="category-touch-rail no-scrollbar outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--saffron)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ivory)]"
        >
          {CATEGORIES.map((c, i) => (
            <li
              key={c.slug}
              role="listitem"
              data-category-touch-slide
              className="category-touch-slide shrink-0"
            >
              <div className="category-touch-card-frame">
                <CategoryCard c={c} index={i} touchLayout />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:hidden flex items-center justify-center gap-4 mt-8 px-4 md:px-10">
        <button
          type="button"
          aria-label="Previous category"
          disabled={atStart}
          onClick={() => scroll(-1)}
          className="category-touch-nav-btn w-11 h-11 rounded-full border hairline flex items-center justify-center text-[color:var(--ink)] bg-white/80 hover:bg-[color:var(--bone)] active:scale-95 transition shadow-sm"
        >
          <Chevron dir="left" />
        </button>
        <p
          className="text-[11px] tracking-[0.2em] uppercase text-[color:var(--ink-soft)] tabular-nums min-w-[4.5rem] text-center"
          aria-live="polite"
        >
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(CATEGORIES.length).padStart(2, "0")}
        </p>
        <button
          type="button"
          aria-label="Next category"
          disabled={atEnd}
          onClick={() => scroll(1)}
          className="category-touch-nav-btn w-11 h-11 rounded-full border hairline flex items-center justify-center text-[color:var(--ink)] bg-white/80 hover:bg-[color:var(--bone)] active:scale-95 transition shadow-sm"
        >
          <Chevron dir="right" />
        </button>
      </div>
    </>
  );
}

export function CategoryShowcase({ showPlanner = true }: { showPlanner?: boolean }) {
  const scroller = useRef<HTMLDivElement | null>(null);

  const scroll = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section
      id="explore-by-categories"
      className="relative bg-[color:var(--ivory)] py-12 md:py-20"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between gap-8 mb-6 md:mb-8">
          <ScrollReveal className="max-w-2xl">
            <p className="eyebrow">Seven ways in</p>
            <h2 className="display-lg mt-4 text-[color:var(--ink)] text-balance">
              Choose the Maharashtra{" "}
              <em className="italic font-normal text-[color:var(--terracotta)]">
                that calls you
              </em>
              .
            </h2>
            <p className="lede mt-5">
              From the rock-cut quiet of Ajanta to the wind on a Konkan beach,
              every journey here starts with an interest, not an itinerary.
            </p>
          </ScrollReveal>

          <div className="hidden lg:flex gap-2">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scroll(-1)}
              className="w-11 h-11 rounded-full border hairline flex items-center justify-center text-[color:var(--ink)] hover:bg-[color:var(--bone)] transition"
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scroll(1)}
              className="w-11 h-11 rounded-full border hairline flex items-center justify-center text-[color:var(--ink)] hover:bg-[color:var(--bone)] transition"
            >
              <Chevron dir="right" />
            </button>
          </div>
        </div>
      </div>

      <CategoryTouchCarousel />

      {/* Desktop rail — unchanged from legacy layout */}
      <div
        ref={scroller}
        className="hidden lg:block no-scrollbar overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory"
      >
        <ul className="flex gap-5 md:gap-7 px-6 md:px-10 pb-2 pr-[10%]">
          {CATEGORIES.map((c, i) => (
            <li
              key={c.slug}
              className="snap-start shrink-0 w-[78vw] sm:w-[52vw] md:w-[40vw] lg:w-[30vw] xl:w-[26vw]"
            >
              <CategoryCard c={c} index={i} />
            </li>
          ))}
        </ul>
      </div>

      {showPlanner && (
        <SmartKeywordItinerary
          context="explore"
          heading="Explore Maharashtra your way"
          subheading="Choose the themes that match your trip, then generate a personalized AI itinerary."
          className="bg-[color:var(--bone)]/60 border-t hairline mt-8 md:mt-12"
          compact
        />
      )}
    </section>
  );
}

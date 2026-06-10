"use client";
import Link from "next/link";
import { useRef } from "react";
import { CATEGORIES } from "./data";
import { ScrollReveal } from "./ScrollReveal";

export function CategoryShowcase() {
  const scroller = useRef<HTMLDivElement | null>(null);

  const scroll = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section
      id="explore-by-categories"
      className="relative bg-[color:var(--ivory)] py-24 md:py-36"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between gap-8 mb-12 md:mb-16">
          <ScrollReveal className="max-w-2xl">
            <p className="eyebrow">Seven ways in</p>
            <h2 className="display-lg mt-4 text-[color:var(--ink)] text-balance">
              Choose the Maharashtra <em className="italic font-normal text-[color:var(--terracotta)]">that calls you</em>.
            </h2>
            <p className="lede mt-5">
              From the rock-cut quiet of Ajanta to the wind on a Konkan beach,
              every journey here starts with an interest, not an itinerary.
            </p>
          </ScrollReveal>

          <div className="hidden md:flex gap-2">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scroll(-1)}
              className="w-11 h-11 rounded-full border hairline flex items-center justify-center text-[color:var(--ink)] hover:bg-[color:var(--bone)] transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scroll(1)}
              className="w-11 h-11 rounded-full border hairline flex items-center justify-center text-[color:var(--ink)] hover:bg-[color:var(--bone)] transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal scroll rail */}
      <div
        ref={scroller}
        className="no-scrollbar overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory"
      >
        <ul className="flex gap-5 md:gap-7 px-6 md:px-10 pb-2 pr-[10%]">
          {CATEGORIES.map((c, i) => (
            <li
              key={c.slug}
              className="snap-start shrink-0 w-[78vw] sm:w-[52vw] md:w-[40vw] lg:w-[30vw] xl:w-[26vw]"
            >
              <Link
                href={`/category/${c.slug}`}
                className="group block"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-[color:var(--bone)]">
                  <img
                    src={c.image}
                    alt={c.title}
                    loading={i < 2 ? "eager" : "lazy"}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                  <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                    <span className="text-[11px] tracking-[0.25em] uppercase text-white/85 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1">
                      {c.accent}
                    </span>
                    <span className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center text-[15px] transition group-hover:bg-white group-hover:text-[color:var(--ink)]">
                      →
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-white text-2xl md:text-[28px] leading-tight text-balance">
                      {c.title}
                    </h3>
                    <p className="text-white/80 text-sm mt-2 line-clamp-2">
                      {c.short}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

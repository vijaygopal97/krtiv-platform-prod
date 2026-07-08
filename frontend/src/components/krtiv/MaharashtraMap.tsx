"use client";
import { useMemo, useState } from "react";
import type { CategoryItinerary } from "./data";
import { ScrollReveal } from "./ScrollReveal";
import { itineraryHasMapPoints } from "./maharashtraMapUtils";
import { MaharashtraMapVisual } from "./MaharashtraMapVisual";

export function MaharashtraMap({
  itinerary,
  mapOnly = false,
}: {
  itinerary: CategoryItinerary;
  /** Hide day sidebar (avoids duplicating itinerary on place pages). */
  mapOnly?: boolean;
}) {
  const hasMap = useMemo(() => itineraryHasMapPoints(itinerary), [itinerary]);
  const [active, setActive] = useState(0);

  if (!hasMap) return null;

  return (
    <section className="relative bg-[color:var(--bone)] border-t hairline py-12 md:py-16">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 items-end mb-12">
          <ScrollReveal className="md:col-span-7">
            <p className="eyebrow">On the map</p>
            <h2 id="place-map-heading" className="display-lg mt-4 text-balance">
              See where in Maharashtra you're going.
            </h2>
          </ScrollReveal>
          <ScrollReveal className="md:col-span-5" delay={120}>
            <p className="lede">
              Each stop on this itinerary, pinned across the state. Switch days to see every visit on the map.
            </p>
          </ScrollReveal>
        </div>

        <div className={`grid gap-8 ${mapOnly ? '' : 'md:grid-cols-12'}`}>
          <ScrollReveal className={mapOnly ? '' : 'md:col-span-8'}>
            <MaharashtraMapVisual
              itinerary={itinerary}
              activeDay={active}
              onActiveDayChange={setActive}
              aspectClassName="aspect-[4/3]"
            />
          </ScrollReveal>

          {!mapOnly && (
          <div className="md:col-span-4">
            <div className="sticky top-28 space-y-3">
              {itinerary.days.map((d, i) => {
                const isActive = active === i;
                return (
                  <button
                    key={d.day}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className={`w-full text-left rounded-2xl border p-5 transition-all ${
                      isActive
                        ? "bg-[color:var(--ink)] text-white border-[color:var(--ink)] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.5)]"
                        : "bg-white hairline hover:border-[color:var(--ink)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex w-9 h-9 items-center justify-center rounded-full text-xs font-display ${
                          isActive
                            ? "bg-white text-[color:var(--ink)]"
                            : "bg-[color:var(--bone)] text-[color:var(--ink)]"
                        }`}
                      >
                        {d.day}
                      </span>
                      <div>
                        <p className={`text-[10px] tracking-[0.3em] uppercase ${isActive ? "text-white/60" : "text-[color:var(--ink-soft)]"}`}>
                          Day {d.day}
                        </p>
                        <p className="font-display text-lg leading-tight">{d.location}</p>
                      </div>
                    </div>
                    {isActive && (
                      <div className="mt-4 pt-4 border-t border-white/15 space-y-2 animate-[krtiv-fade_400ms_ease-out_both]">
                        {d.activities.slice(0, 3).map((a, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-[13px]">
                            <span className="text-white/60 mt-0.5">{a.icon}</span>
                            <div className="flex-1">
                              <p className="text-white">{a.title}</p>
                              <p className="text-white/60 text-[12px]">
                                {a.time}
                                {a.duration ? ` · ${a.duration}` : ''}
                              </p>
                            </div>
                          </div>
                        ))}
                        <a
                          href="#itinerary"
                          className="inline-flex items-center gap-2 mt-3 text-[12px] tracking-[0.25em] uppercase text-white/80 hover:text-white"
                        >
                          Read full day <span aria-hidden>→</span>
                        </a>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          )}
        </div>
      </div>
    </section>
  );
}

"use client";
import Link from "next/link";
import { useState } from "react";
import type { CategoryItinerary } from "./data";
import { ScrollReveal } from "./ScrollReveal";

export function ItineraryStory({
  itinerary,
}: {
  itinerary: CategoryItinerary;
}) {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <section
      id="itinerary"
      className="relative bg-[color:var(--ivory)] py-24 md:py-36 border-t hairline"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-12 items-end mb-16">
          <ScrollReveal className="md:col-span-7">
            <p className="eyebrow">{itinerary.region}</p>
            <h2 className="display-lg mt-4 text-balance">
              {itinerary.subtitle}
            </h2>
          </ScrollReveal>
          <ScrollReveal className="md:col-span-5" delay={120}>
            <p className="lede">{itinerary.description}</p>
          </ScrollReveal>
        </div>

        {/* Day selector */}
        <div className="flex items-stretch gap-2 overflow-x-auto no-scrollbar border-b hairline pb-4 mb-12 md:mb-16">
          {itinerary.days.map((d, i) => {
            const active = activeDay === i;
            return (
              <button
                key={d.day}
                type="button"
                onClick={() => setActiveDay(i)}
                aria-pressed={active}
                className={`shrink-0 inline-flex items-center gap-3 h-11 px-5 rounded-full border text-sm leading-none transition ${
                  active
                    ? "bg-[color:var(--ink)] text-white border-[color:var(--ink)]"
                    : "bg-transparent text-[color:var(--ink-soft)] hairline hover:text-[color:var(--ink)]"
                }`}
              >
                <span className="font-display text-[14px] leading-none">Day {d.day}</span>
                <span className={`h-3 w-px ${active ? "bg-white/40" : "bg-current opacity-30"}`} />
                <span className="text-[13px] leading-none opacity-80">{d.location}</span>
              </button>
            );
          })}
        </div>

        {/* Active day panel */}
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5 md:sticky md:top-28 self-start">
            <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden bg-[color:var(--bone)]">
              <img
                key={itinerary.days[activeDay].image}
                src={itinerary.days[activeDay].image}
                alt={itinerary.days[activeDay].location}
                className="absolute inset-0 w-full h-full object-cover animate-[krtiv-fade_700ms_ease-out_both]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
              <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                <p className="text-[11px] tracking-[0.3em] uppercase text-white/75">
                  Day {itinerary.days[activeDay].day}
                </p>
                <h3 className="font-display text-3xl md:text-4xl mt-2">
                  {itinerary.days[activeDay].location}
                </h3>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <ol className="space-y-0">
              {itinerary.days[activeDay].activities.map((a, idx) => (
                <li
                  key={`${activeDay}-${idx}`}
                  className="group grid grid-cols-[60px_1fr] md:grid-cols-[120px_1fr] gap-6 py-8 border-t hairline first:border-t-0 animate-[krtiv-rise_700ms_cubic-bezier(0.22,1,0.36,1)_both]"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div>
                    <p className="text-[11px] tracking-[0.25em] uppercase text-[color:var(--ink-soft)]">
                      {a.time}
                    </p>
                    <p className="mt-2 text-sm text-[color:var(--ink-soft)]">
                      {a.duration}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-[color:var(--bone)] text-[color:var(--terracotta)] text-sm">
                        {a.icon}
                      </span>
                      <h4 className="font-display text-xl md:text-2xl text-[color:var(--ink)]">
                        {a.title}
                      </h4>
                    </div>
                    <p className="mt-3 text-[15px] text-[color:var(--ink)]">
                      {a.description}
                    </p>
                    <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--ink-soft)] max-w-2xl">
                      {a.details}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-12 flex flex-wrap gap-3 pt-6 border-t hairline">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[color:var(--ink)] text-white text-sm hover:opacity-90 transition"
              >
                Build my own version <span aria-hidden>→</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full border hairline text-sm text-[color:var(--ink)] hover:bg-[color:var(--bone)] transition"
              >
                Talk to a planner
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

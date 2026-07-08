"use client";
import Link from "next/link";
import { useState } from "react";
import type { CategoryItinerary } from "./data";
import { ScrollReveal } from "./ScrollReveal";
import { MaharashtraMapVisual } from "./MaharashtraMapVisual";
import { ItineraryDayFavorite } from "@/components/places/ItineraryDayFavorite";

export function ItineraryStory({
  itinerary,
  sectionId = "itinerary",
  heading,
  sidePanel = "image",
  mapPanelId = "itinerary-map",
  seamlessTop = false,
  showTalkToPlanner = false,
  plannerAnchor = '#category-smart-itinerary',
}: {
  itinerary: CategoryItinerary;
  sectionId?: string;
  heading?: string;
  /** Embedded interactive map instead of a photo card (Places to Go & Things to Do). */
  sidePanel?: "image" | "map";
  mapPanelId?: string;
  /** Omit top rule when preceded by hero bridge (Places to Go). */
  seamlessTop?: boolean;
  /** Show secondary "Talk to a planner" CTA (off on Places to Go). */
  showTalkToPlanner?: boolean;
  /** Scroll target for "Build my own version" (smart planner at page top). */
  plannerAnchor?: string;
}) {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <section
      id={sectionId}
      className={`relative bg-[color:var(--ivory)] ${
        seamlessTop ? 'pt-4 md:pt-8 pb-12 md:pb-20' : 'py-12 md:py-20 border-t hairline'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-12 items-end mb-16">
          <ScrollReveal className="md:col-span-7">
            <p className="eyebrow">{itinerary.region}</p>
            <h2 className="display-lg mt-4 text-balance">
              {heading ?? itinerary.subtitle}
            </h2>
          </ScrollReveal>
          <ScrollReveal className="md:col-span-5" delay={120}>
            <p className="lede">{itinerary.description}</p>
          </ScrollReveal>
        </div>

        {/* Day selector — hidden for single-day place itineraries */}
        {itinerary.days.length > 1 ? (
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
        ) : (
        <div className="border-b hairline pb-4 mb-12 md:mb-16" />
        )}

        {/* Active day panel */}
        <div className="grid md:grid-cols-12 gap-10 lg:gap-12">
          <div
            className={`${
              sidePanel === "map" ? "md:col-span-6" : "md:col-span-5"
            } md:sticky md:top-28 self-start order-1`}
          >
            {sidePanel === "map" ? (
              <MaharashtraMapVisual
                id={mapPanelId}
                itinerary={itinerary}
                activeDay={activeDay}
                onActiveDayChange={setActiveDay}
                aspectClassName="aspect-[4/3] sm:aspect-[5/4] md:aspect-[4/5] min-h-[280px]"
              />
            ) : (
            <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden bg-[color:var(--bone)]">
              <img
                key={itinerary.days[activeDay].image}
                src={itinerary.days[activeDay].image}
                alt={itinerary.days[activeDay].location}
                className="absolute inset-0 w-full h-full object-cover animate-[krtiv-fade_700ms_ease-out_both]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
              <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] tracking-[0.3em] uppercase text-white/75">
                      Day {itinerary.days[activeDay].day}
                    </p>
                    <h3 className="font-display text-3xl md:text-4xl mt-2">
                      {itinerary.days[activeDay].location}
                    </h3>
                  </div>
                  <ItineraryDayFavorite
                    location={itinerary.days[activeDay].location}
                    image={itinerary.days[activeDay].image}
                  />
                </div>
              </div>
            </div>
            )}
          </div>

          <div className={`${sidePanel === "map" ? "md:col-span-6" : "md:col-span-7"} order-2`}>
            {sidePanel === "map" ? (
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  {itinerary.days.length > 1 ? (
                    <p className="text-[11px] tracking-[0.25em] uppercase text-[color:var(--ink-soft)]">
                      Day {itinerary.days[activeDay].day}
                    </p>
                  ) : null}
                  <h3 className={`font-display text-2xl md:text-3xl ${itinerary.days.length > 1 ? 'mt-1' : ''} text-[color:var(--ink)]`}>
                    {itinerary.days[activeDay].location}
                  </h3>
                </div>
                <ItineraryDayFavorite
                  location={itinerary.days[activeDay].location}
                  image={itinerary.days[activeDay].image}
                />
              </div>
            ) : null}
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
                    {a.duration ? (
                      <p className="mt-2 text-sm text-[color:var(--ink-soft)]">{a.duration}</p>
                    ) : null}
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

            <div
              className={`mt-12 pt-6 border-t hairline flex flex-wrap gap-3${showTalkToPlanner ? '' : ' justify-center'}`}
            >
              <a
                href={plannerAnchor}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[color:var(--ink)] text-white text-sm hover:opacity-90 transition"
                onClick={(e) => {
                  const id = plannerAnchor.replace(/^#/, '');
                  const el = document.getElementById(id);
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                Build my own version <span aria-hidden>→</span>
              </a>
              {showTalkToPlanner ? (
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-full border hairline text-sm text-[color:var(--ink)] hover:bg-[color:var(--bone)] transition"
                >
                  Talk to a planner
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";
import { useMemo, useState } from "react";
import type { CategoryItinerary } from "./data";
import { ScrollReveal } from "./ScrollReveal";
import { MAHARASHTRA_BOUNDARY_PATH } from "./maharashtraBoundary";

// Approximate coordinates (lat, lng) for itinerary locations across Maharashtra.
// Keyed by case-insensitive substring match against the day's location label.
const COORDS: Array<{ match: RegExp; lat: number; lng: number; label?: string }> = [
  { match: /igatpuri/i, lat: 19.69, lng: 73.55 },
  { match: /malshej/i, lat: 19.35, lng: 73.77 },
  { match: /lonavala/i, lat: 18.75, lng: 73.41 },
  { match: /raigad/i, lat: 18.23, lng: 73.44 },
  { match: /pune/i, lat: 18.52, lng: 73.86 },
  { match: /aurangabad|chhatrapati sambhaji/i, lat: 19.88, lng: 75.34 },
  { match: /nashik/i, lat: 19.99, lng: 73.79 },
  { match: /shirdi/i, lat: 19.77, lng: 74.48 },
  { match: /bhimashankar/i, lat: 19.07, lng: 73.53 },
  { match: /alibaug/i, lat: 18.64, lng: 72.87 },
  { match: /mahabaleshwar/i, lat: 17.92, lng: 73.66 },
  { match: /kolhapur/i, lat: 16.70, lng: 74.24 },
  { match: /mumbai/i, lat: 19.07, lng: 72.87 },
  { match: /paithan/i, lat: 19.48, lng: 75.38 },
  { match: /warli/i, lat: 19.80, lng: 72.95, label: "Warli Country" },
  { match: /nagpur/i, lat: 21.15, lng: 79.09 },
];

// Map bounding box — Maharashtra extents.
const BOUNDS = { minLat: 15.5, maxLat: 22.2, minLng: 72.5, maxLng: 80.9 };
const MAP_TRANSFORM = "translate(4 2) scale(0.92)";

function project(lat: number, lng: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
  // SVG y grows downward; flip latitude
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { x, y };
}

function lookup(location: string) {
  for (const c of COORDS) if (c.match.test(location)) return c;
  return null;
}

export function MaharashtraMap({ itinerary }: { itinerary: CategoryItinerary }) {
  const points = useMemo(() => {
    return itinerary.days
      .map((d, idx) => {
        const c = lookup(d.location);
        if (!c) return null;
        const p = project(c.lat, c.lng);
        return { ...p, day: d, index: idx };
      })
      .filter(Boolean) as Array<{ x: number; y: number; day: typeof itinerary.days[number]; index: number }>;
  }, [itinerary]);

  const [active, setActive] = useState(0);

  // Path connecting the days in order
  const routePath = useMemo(() => {
    if (points.length < 2) return "";
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(" ");
  }, [points]);

  if (points.length === 0) return null;

  return (
    <section className="relative bg-[color:var(--bone)] border-t hairline py-24 md:py-32">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 items-end mb-12">
          <ScrollReveal className="md:col-span-7">
            <p className="eyebrow">On the map</p>
            <h2 className="display-lg mt-4 text-balance">
              See where in Maharashtra you're going.
            </h2>
          </ScrollReveal>
          <ScrollReveal className="md:col-span-5" delay={120}>
            <p className="lede">
              Each stop on this itinerary, pinned across the state. Tap a marker to read the day.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Map */}
          <ScrollReveal className="md:col-span-8">
            <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden border hairline bg-[color:var(--map-water)] shadow-[0_40px_120px_-70px_rgba(47,71,62,0.65)]">
              {/* Topographic grain */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full"
                aria-hidden
              >
                <defs>
                  <linearGradient id="mh-sea" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--map-water)" />
                    <stop offset="100%" stopColor="var(--map-water-deep)" />
                  </linearGradient>
                  <linearGradient id="mh-terrain" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--map-land-light)" />
                    <stop offset="48%" stopColor="var(--map-land-mid)" />
                    <stop offset="100%" stopColor="var(--map-land-green)" />
                  </linearGradient>
                  <pattern id="mh-grid" width="4" height="4" patternUnits="userSpaceOnUse">
                    <path d="M4 0H0V4" fill="none" stroke="rgba(48,72,54,0.08)" strokeWidth="0.18" />
                  </pattern>
                  <radialGradient id="mh-glow" cx="50%" cy="45%" r="60%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.42)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </radialGradient>
                </defs>
                <rect width="100" height="100" fill="url(#mh-sea)" />
                <path d="M16 0 H100 V100 H9 C15 86 20 72 18 56 C16 39 15 20 21 0 Z" fill="url(#mh-terrain)" opacity="0.78" />
                <path d="M4 18 C9 20 13 19 18 16 M2 35 C8 32 13 33 18 36 M1 53 C7 49 13 49 19 52 M0 69 C7 66 12 66 18 70 M1 84 C8 81 13 82 18 86" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="0.32" />
                <rect width="100" height="100" fill="url(#mh-grid)" opacity="0.55" />
                <rect width="100" height="100" fill="url(#mh-glow)" />
              </svg>

              {/* Map content with proper aspect for projection */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
                className="absolute inset-0 w-full h-full"
                role="img"
                aria-label="Map of Maharashtra with itinerary stops"
              >
                <defs>
                  <clipPath id="mh-state-clip">
                    <path d={MAHARASHTRA_BOUNDARY_PATH} />
                  </clipPath>
                  <linearGradient id="mh-state-fill" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--map-land-light)" />
                    <stop offset="42%" stopColor="var(--map-land-mid)" />
                    <stop offset="100%" stopColor="var(--map-land-green)" />
                  </linearGradient>
                  <filter id="mh-state-shadow" x="-15%" y="-15%" width="130%" height="130%">
                    <feDropShadow dx="0" dy="1.2" stdDeviation="1.2" floodColor="rgba(29,37,28,0.34)" />
                  </filter>
                </defs>
                <g transform={MAP_TRANSFORM}>
                  <g filter="url(#mh-state-shadow)">
                    <path
                      d={MAHARASHTRA_BOUNDARY_PATH}
                      fill="url(#mh-state-fill)"
                      stroke="var(--map-border)"
                      strokeWidth="0.42"
                      strokeLinejoin="round"
                    />
                  </g>
                  <g clipPath="url(#mh-state-clip)" opacity="0.68">
                    <path d="M 14 17 C 25 11 34 15 44 12 S 62 12 76 9 M 16 30 C 29 23 45 29 57 24 S 78 23 91 18 M 14 43 C 28 37 41 42 55 36 S 77 35 94 31 M 13 56 C 28 50 42 55 57 49 S 76 48 93 44 M 12 69 C 27 62 43 68 58 61 S 77 62 91 57 M 11 82 C 27 75 42 80 58 74 S 76 76 90 70" fill="none" stroke="var(--map-contour)" strokeWidth="0.25" />
                    <path d="M 14 23 Q 18 38 16 54 T 21 82" fill="none" stroke="rgba(77,72,39,0.45)" strokeWidth="0.42" strokeDasharray="0.7 0.75" />
                  </g>
                  <text x="66" y="87" fontSize="1.7" fill="rgba(36,50,34,0.46)" style={{ letterSpacing: "0.18em" }}>
                    DECCAN PLATEAU
                  </text>
                </g>
                {/* Coast line label */}
                <text
                  x="6"
                  y="52"
                  fontSize="2"
                  fill="rgba(15,72,91,0.58)"
                  style={{ letterSpacing: "0.25em" }}
                  transform="rotate(-78 8 50)"
                >
                  ARABIAN SEA
                </text>

                <g transform={MAP_TRANSFORM}>
                  {/* Route line */}
                  {routePath && (
                    <path
                      d={routePath}
                      fill="none"
                      stroke="var(--terracotta, #B5562D)"
                      strokeWidth="0.6"
                      strokeLinecap="round"
                      strokeDasharray="1.2 1.2"
                      className="krtiv-route"
                    />
                  )}

                  {/* Pins */}
                  {points.map((p, i) => {
                    const isActive = active === i;
                    return (
                      <g
                        key={i}
                        transform={`translate(${p.x} ${p.y})`}
                        onClick={() => setActive(i)}
                        style={{ cursor: "pointer" }}
                        className="krtiv-pin"
                      >
                      {/* Pulsing halo for active */}
                      {isActive && (
                        <circle r="3.5" fill="var(--terracotta, #B5562D)" opacity="0.18">
                          <animate
                            attributeName="r"
                            values="2.2;4.6;2.2"
                            dur="2.2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.35;0;0.35"
                            dur="2.2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                      <circle
                        r={isActive ? 1.9 : 1.4}
                        fill={isActive ? "var(--terracotta, #B5562D)" : "#1a1410"}
                        stroke="#fff"
                        strokeWidth="0.4"
                        style={{ transition: "all 240ms cubic-bezier(0.22,1,0.36,1)" }}
                      />
                      <text
                        x="0"
                        y={-2.6}
                        textAnchor="middle"
                        fontSize="1.9"
                        fontWeight={600}
                        fill={isActive ? "var(--terracotta, #B5562D)" : "#1a1410"}
                        style={{ pointerEvents: "none" }}
                      >
                        {p.day.day}
                      </text>
                      <text
                        x="0"
                        y={3.6}
                        textAnchor="middle"
                        fontSize="1.8"
                        fill="rgba(26,20,16,0.85)"
                        style={{ pointerEvents: "none", letterSpacing: "0.04em" }}
                      >
                        {p.day.location.split("—")[0].trim()}
                      </text>
                      </g>
                    );
                  })}
                </g>
              </svg>

              {/* Compass */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/70 backdrop-blur flex items-center justify-center text-[10px] tracking-widest text-[color:var(--ink-soft)] border hairline">
                N
              </div>
              {/* Scale chip */}
              <div className="absolute bottom-4 left-4 text-[10px] tracking-[0.25em] uppercase text-[color:var(--ink-soft)] bg-white/70 backdrop-blur px-3 py-1.5 rounded-full border hairline">
                Maharashtra · {points.length} stops
              </div>
            </div>
          </ScrollReveal>

          {/* Side panel */}
          <div className="md:col-span-4">
            <div className="sticky top-28 space-y-3">
              {points.map((p, i) => {
                const isActive = active === i;
                return (
                  <button
                    key={i}
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
                        {p.day.day}
                      </span>
                      <div>
                        <p className={`text-[10px] tracking-[0.3em] uppercase ${isActive ? "text-white/60" : "text-[color:var(--ink-soft)]"}`}>
                          Day {p.day.day}
                        </p>
                        <p className="font-display text-lg leading-tight">{p.day.location}</p>
                      </div>
                    </div>
                    {isActive && (
                      <div className="mt-4 pt-4 border-t border-white/15 space-y-2 animate-[krtiv-fade_400ms_ease-out_both]">
                        {p.day.activities.slice(0, 3).map((a, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-[13px]">
                            <span className="text-white/60 mt-0.5">{a.icon}</span>
                            <div className="flex-1">
                              <p className="text-white">{a.title}</p>
                              <p className="text-white/60 text-[12px]">{a.time} · {a.duration}</p>
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
        </div>
      </div>
    </section>
  );
}

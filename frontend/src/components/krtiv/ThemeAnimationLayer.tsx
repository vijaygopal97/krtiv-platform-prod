"use client";

import { useMemo } from "react";

export type HeroThemeKey =
  | "home"
  | "historical"
  | "spiritual"
  | "adventure"
  | "culinary"
  | "art-culture"
  | "urban"
  | "weddings";

type ParticleAnim = "float-up" | "drift-side" | "fall-down";

type ParticleSpec = {
  count: number;
  symbol: string;
  anim: ParticleAnim;
  sizeRange: [number, number];
  opacityRange: [number, number];
  durationRange: [number, number];
  color?: string;
};

const GOLD = "color-mix(in oklab, var(--saffron-soft) 85%, transparent)";
const MARIGOLD = "color-mix(in oklab, var(--saffron) 75%, transparent)";
const MOSS = "color-mix(in oklab, var(--map-land-green) 85%, transparent)";
const TEAL = "color-mix(in oklab, var(--map-water-deep) 80%, transparent)";

const THEMES: Record<HeroThemeKey, ParticleSpec[]> = {
  home: [
    {
      count: 16,
      symbol: "✦",
      anim: "float-up",
      sizeRange: [8, 14],
      opacityRange: [0.25, 0.6],
      durationRange: [12, 22],
      color: GOLD,
    },
  ],
  historical: [
    {
      count: 22,
      symbol: "·",
      anim: "drift-side",
      sizeRange: [6, 16],
      opacityRange: [0.15, 0.5],
      durationRange: [18, 30],
      color: GOLD,
    },
    {
      count: 14,
      symbol: "✦",
      anim: "float-up",
      sizeRange: [5, 11],
      opacityRange: [0.2, 0.55],
      durationRange: [14, 24],
      color: GOLD,
    },
  ],
  spiritual: [
    {
      count: 20,
      symbol: "✺",
      anim: "float-up",
      sizeRange: [10, 18],
      opacityRange: [0.4, 0.85],
      durationRange: [10, 18],
      color: MARIGOLD,
    },
    {
      count: 10,
      symbol: "✦",
      anim: "float-up",
      sizeRange: [6, 10],
      opacityRange: [0.3, 0.7],
      durationRange: [14, 22],
      color: GOLD,
    },
  ],
  adventure: [
    {
      count: 26,
      symbol: "❦",
      anim: "fall-down",
      sizeRange: [10, 18],
      opacityRange: [0.35, 0.7],
      durationRange: [12, 22],
      color: MOSS,
    },
    {
      count: 12,
      symbol: "✧",
      anim: "float-up",
      sizeRange: [4, 9],
      opacityRange: [0.25, 0.6],
      durationRange: [10, 18],
      color: "color-mix(in oklab, var(--ivory) 70%, transparent)",
    },
  ],
  culinary: [
    {
      count: 14,
      symbol: "❀",
      anim: "float-up",
      sizeRange: [14, 26],
      opacityRange: [0.1, 0.3],
      durationRange: [10, 18],
      color: "color-mix(in oklab, var(--ivory) 80%, transparent)",
    },
    {
      count: 16,
      symbol: "·",
      anim: "drift-side",
      sizeRange: [5, 12],
      opacityRange: [0.2, 0.5],
      durationRange: [16, 28],
      color: MARIGOLD,
    },
  ],
  "art-culture": [
    {
      count: 18,
      symbol: "◇",
      anim: "drift-side",
      sizeRange: [10, 18],
      opacityRange: [0.4, 0.7],
      durationRange: [16, 26],
      color: "var(--ivory)",
    },
  ],
  urban: [
    {
      count: 28,
      symbol: "│",
      anim: "drift-side",
      sizeRange: [40, 120],
      opacityRange: [0.1, 0.35],
      durationRange: [4, 9],
      color: TEAL,
    },
    {
      count: 14,
      symbol: "✦",
      anim: "float-up",
      sizeRange: [4, 10],
      opacityRange: [0.25, 0.65],
      durationRange: [8, 16],
      color: TEAL,
    },
  ],
  weddings: [
    {
      count: 24,
      symbol: "✿",
      anim: "fall-down",
      sizeRange: [12, 22],
      opacityRange: [0.55, 0.9],
      durationRange: [10, 18],
      color: MARIGOLD,
    },
    {
      count: 12,
      symbol: "✦",
      anim: "float-up",
      sizeRange: [6, 12],
      opacityRange: [0.4, 0.8],
      durationRange: [12, 20],
      color: GOLD,
    },
  ],
};

/** Deterministic PRNG so SSR and client hydration match (no Math.random). */
function hashSeed(...parts: (string | number)[]) {
  let h = 2166136261;
  for (const p of parts) {
    const s = String(p);
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
  }
  return h >>> 0;
}

function createSeededRng(seed: number) {
  let state = seed || 1;
  return (min: number, max: number) => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    const u = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    return min + u * (max - min);
  };
}

function roundStyle(n: number, digits = 4) {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

export function resolveHeroThemeKey(category?: string): HeroThemeKey {
  if (!category || category === "home") return "home";
  if (category in THEMES) return category as HeroThemeKey;
  return "home";
}

type Props = {
  theme?: HeroThemeKey;
};

/** Ambient hero particles keyed by page theme (home + each category). */
export function ThemeAnimationLayer({ theme = "home" }: Props) {
  const specs = THEMES[theme] ?? THEMES.home;

  const particles = useMemo(() => {
    const list: Array<{
      key: string;
      symbol: string;
      left: string;
      size: number;
      duration: number;
      delay: number;
      opacity: number;
      anim: ParticleAnim;
      color?: string;
    }> = [];

    specs.forEach((spec, si) => {
      for (let i = 0; i < spec.count; i++) {
        const rng = createSeededRng(hashSeed(theme, si, i));
        list.push({
          key: `${theme}-${si}-${i}`,
          symbol: spec.symbol,
          left: `${roundStyle(rng(0, 100))}%`,
          size: roundStyle(rng(spec.sizeRange[0], spec.sizeRange[1]), 3),
          duration: roundStyle(rng(spec.durationRange[0], spec.durationRange[1]), 3),
          delay: -roundStyle(rng(0, spec.durationRange[1]), 3),
          opacity: roundStyle(rng(spec.opacityRange[0], spec.opacityRange[1]), 4),
          anim: spec.anim,
          color: spec.color,
        });
      }
    });

    return list;
  }, [theme, specs]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden z-[1]">
      {particles.map((p) => (
        <span
          key={p.key}
          className={`hero-theme-particle hero-theme-${p.anim}`}
          style={{
            left: p.left,
            bottom: p.anim === "fall-down" ? "auto" : "-10vh",
            top: p.anim === "fall-down" ? "-10vh" : "auto",
            fontSize: `${p.size}px`,
            color: p.color,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            textShadow: "0 0 12px currentColor",
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}

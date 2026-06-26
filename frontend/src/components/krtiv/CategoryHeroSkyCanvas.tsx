"use client";

import { useEffect, useRef } from "react";
import type { HeroThemeKey } from "./ThemeAnimationLayer";
import {
  getAmbientThemeProfile,
  type AmbientMotionKind,
} from "@/lib/categoryHeroSky";

type Props = {
  theme: HeroThemeKey;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  layer: number;
  kind: AmbientMotionKind | "orb";
  rgb: string;
  phase: number;
  streakLen?: number;
};

const DESKTOP_COUNT = 22;
const MOBILE_COUNT = 11;
const DESKTOP_BREAKPOINT = 1024;
const ORB_COUNT_DESKTOP = 2;
const ORB_COUNT_MOBILE = 1;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pickColor(colors: string[]) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function motionForKind(
  kind: AmbientMotionKind,
  layer: number,
): { vx: number; vy: number; size: number; streakLen?: number } {
  const slow = layer === 0 ? 0.35 : layer === 1 ? 0.55 : 0.75;
  switch (kind) {
    case "dust":
      return { vx: rand(-0.08, 0.08) * slow, vy: rand(0.04, 0.14) * slow, size: rand(1, 3) };
    case "mist":
      return { vx: rand(0.06, 0.18) * slow, vy: rand(-0.04, 0.06) * slow, size: rand(2, 4) };
    case "steam":
      return { vx: rand(-0.06, 0.06) * slow, vy: rand(-0.12, -0.04) * slow, size: rand(1.5, 3.5) };
    case "float":
      return { vx: rand(-0.1, 0.1) * slow, vy: rand(-0.08, 0.08) * slow, size: rand(1, 3.5) };
    case "streak":
      return {
        vx: rand(0.12, 0.28) * slow * (Math.random() > 0.5 ? 1 : -1),
        vy: rand(-0.02, 0.02) * slow,
        size: rand(1, 2),
        streakLen: rand(8, 22),
      };
    case "bokeh":
      return { vx: rand(-0.05, 0.05) * slow, vy: rand(-0.06, 0.06) * slow, size: rand(2.5, 4) };
    case "glow":
      return { vx: rand(-0.06, 0.06) * slow, vy: rand(-0.05, 0.05) * slow, size: rand(1, 3) };
    case "divine":
      return { vx: rand(-0.04, 0.04) * slow, vy: rand(-0.1, -0.03) * slow, size: rand(1, 3) };
    default:
      return { vx: 0, vy: 0.05, size: 2 };
  }
}

function createParticle(
  w: number,
  h: number,
  profile: ReturnType<typeof getAmbientThemeProfile>,
  layer: number,
): Particle {
  const useAccent = Math.random() < profile.accentRatio;
  const kind: AmbientMotionKind =
    useAccent && profile.motion !== "float" ? "float" : profile.motion;
  const motion = motionForKind(kind, layer);
  return {
    x: rand(0, w),
    y: rand(0, h),
    vx: motion.vx,
    vy: motion.vy,
    size: motion.size,
    opacity: rand(0.05, 0.15),
    layer,
    kind,
    rgb: pickColor(profile.colors),
    phase: rand(0, Math.PI * 2),
    streakLen: motion.streakLen,
  };
}

function createOrb(w: number, h: number, rgb: string): Particle {
  return {
    x: rand(w * 0.15, w * 0.85),
    y: rand(h * 0.2, h * 0.75),
    vx: rand(-0.02, 0.02),
    vy: rand(-0.025, 0.025),
    size: rand(80, 160),
    opacity: rand(0.03, 0.06),
    layer: 0,
    kind: "orb",
    rgb,
    phase: rand(0, Math.PI * 2),
  };
}

function initParticles(
  w: number,
  h: number,
  profile: ReturnType<typeof getAmbientThemeProfile>,
  count: number,
  orbCount: number,
): Particle[] {
  const list: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const layer = i % 3;
    list.push(createParticle(w, h, profile, layer));
  }
  for (let i = 0; i < orbCount; i++) {
    list.push(createOrb(w, h, pickColor(profile.colors)));
  }
  return list;
}

function wrapParticle(p: Particle, w: number, h: number) {
  const pad = 40;
  if (p.x < -pad) p.x = w + pad;
  if (p.x > w + pad) p.x = -pad;
  if (p.y < -pad) p.y = h + pad;
  if (p.y > h + pad) p.y = -pad;
}

/** Subtle luxury ambient particles (category + home Explore heroes). */
export function CategoryHeroSkyCanvas({ theme }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const profile = getAmbientThemeProfile(theme);
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let rafId = 0;
    let lastTs = 0;
    let reducedMotion = false;
    let isMobile = false;
    let running = true;
    let visible = true;

    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopMq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);

    const syncPrefs = () => {
      reducedMotion = reducedMq.matches;
      isMobile = !desktopMq.matches;
    };
    syncPrefs();

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = isMobile ? MOBILE_COUNT : DESKTOP_COUNT;
      const orbs = isMobile ? ORB_COUNT_MOBILE : ORB_COUNT_DESKTOP;
      particles = initParticles(w, h, profile, count, orbs);
    };

    const drawParticle = (p: Particle) => {
      if (p.kind === "orb") {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        g.addColorStop(0, `rgba(${p.rgb}, ${p.opacity})`);
        g.addColorStop(0.55, `rgba(${p.rgb}, ${p.opacity * 0.35})`);
        g.addColorStop(1, `rgba(${p.rgb}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        return;
      }

      const depth = 0.4 + p.layer * 0.2;
      const x = p.x;
      const y = p.y;
      const alpha = p.opacity * depth;

      if (p.kind === "streak" && p.streakLen) {
        ctx.strokeStyle = `rgba(${p.rgb}, ${alpha})`;
        ctx.lineWidth = p.size;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - p.streakLen * Math.sign(p.vx || 1), y);
        ctx.stroke();
        return;
      }

      if (p.kind === "mist" || p.kind === "bokeh") {
        const r = p.size * (p.kind === "bokeh" ? 1.15 : 1.4);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(${p.rgb}, ${alpha * 0.9})`);
        g.addColorStop(1, `rgba(${p.rgb}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        return;
      }

      ctx.fillStyle = `rgba(${p.rgb}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fill();
    };

    const tick = (ts: number) => {
      if (!running) return;
      if (!visible) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.05) : 0.016;
      lastTs = ts;

      ctx.clearRect(0, 0, w, h);

      if (!reducedMotion) {
        for (const p of particles) {
          const drift = p.kind === "orb" ? 0.35 : 1;
          p.x += p.vx * dt * 60 * drift;
          p.y += p.vy * dt * 60 * drift;
          p.phase += dt * 0.15;
          wrapParticle(p, w, h);
        }
      }

      const sorted = [...particles].sort((a, b) => a.layer - b.layer);
      for (const p of sorted) {
        drawParticle(p);
      }

      rafId = requestAnimationFrame(tick);
    };

    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(container);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { root: null, threshold: 0.05 },
    );
    io.observe(container);

    const onReduced = () => syncPrefs();
    const onDesktop = () => {
      syncPrefs();
      resize();
    };
    reducedMq.addEventListener("change", onReduced);
    desktopMq.addEventListener("change", onDesktop);

    rafId = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      reducedMq.removeEventListener("change", onReduced);
      desktopMq.removeEventListener("change", onDesktop);
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="category-hero-ambient pointer-events-none absolute inset-0 z-[2] min-h-[100svh] overflow-visible"
    >
      <canvas ref={canvasRef} className="block h-full min-h-[100svh] w-full" />
    </div>
  );
}

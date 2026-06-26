"use client";
import { useEffect, useRef, useState } from "react";

type HeroProps = {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  image: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  /** Video card props */
  videoSrc?: string;
  videoPoster?: string;
  videoTitle?: string;
  videoMeta?: string;
  exploreHref?: string;
  exploreLabel?: string;
  /**
   * Live SignPost <CategoryVideoWithEngagement /> slot. When provided it
   * REPLACES the placeholder player surface — like/views/CTA chrome stays.
   */
  videoSlot?: React.ReactNode;
  children?: React.ReactNode;
};

export function HeroSection({
  eyebrow = "Maharashtra",
  title,
  titleAccent,
  subtitle,
  image,
  primaryHref = "/#itinerary-generator",
  primaryLabel = "Plan with AI",
  secondaryHref = "/#explore-by-categories",
  secondaryLabel = "Explore the state",
  videoSrc,
  videoPoster,
  videoTitle = "Maharashtra — a short film",
  videoMeta = "2:14 · Featured",
  exploreHref = "/#explore-by-categories",
  exploreLabel = "Explore itinerary",
  videoSlot,
  children,
}: HeroProps) {
  const [y, setY] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reaction, setReaction] = useState<"up" | "down" | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const play = () => {
    const v = videoRef.current;
    if (v) {
      if (v.paused) {
        v.play();
        setPlaying(true);
      } else {
        v.pause();
        setPlaying(false);
      }
    } else {
      // No file: still toggle so the play button hides for the slot/iframe.
      setPlaying((p) => !p);
    }
  };

  const poster = videoPoster ?? image;
  const hasLiveVideo = Boolean(videoSlot);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[color:var(--ink)] text-white">
      {/* Parallax background */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${y * 0.35}px, 0)` }}
        aria-hidden
      >
        <img
          src={image}
          alt=""
          className="w-full h-[120%] object-cover ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/38 via-black/24 to-black/50 md:from-black/28 md:via-black/16 md:to-black/36" />
        <div
          className="absolute inset-0 opacity-35 md:opacity-25"
          style={{
            background:
              "radial-gradient(ellipse at 30% 40%, transparent 0%, rgba(0,0,0,0.42) 80%)",
          }}
        />
      </div>

      {/* Content */}
      <div
        className="relative z-10 min-h-[100svh] flex flex-col"
        style={{ opacity: Math.max(0.25, 1 - y / 1100) }}
      >
        <div className="flex-1 flex items-center">
          <div className="max-w-[1440px] w-full mx-auto px-6 md:px-10 pt-32 pb-24 md:pt-36 md:pb-32">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left: copy */}
              <div className="lg:col-span-7 max-w-2xl">
                <p
                  className="hero-eyebrow animate-[krtiv-fade_900ms_ease-out_both]"
                  style={{ animationDelay: "120ms" }}
                >
                  {eyebrow}
                </p>
                <h1
                  className="display-xl text-white mt-6 text-balance animate-[krtiv-rise_1100ms_cubic-bezier(0.22,1,0.36,1)_both]"
                  style={{ animationDelay: "200ms" }}
                >
                  {title}{" "}
                  {titleAccent && (
                    <span className="italic hero-title-accent">
                      {titleAccent}
                    </span>
                  )}
                </h1>
                {subtitle && (
                  <p
                    className="hero-lede mt-6 max-w-2xl animate-[krtiv-rise_1100ms_cubic-bezier(0.22,1,0.36,1)_both]"
                    style={{ animationDelay: "360ms" }}
                  >
                    {subtitle}
                  </p>
                )}

                <div
                  className="mt-10 flex flex-wrap items-center gap-3 animate-[krtiv-rise_1100ms_cubic-bezier(0.22,1,0.36,1)_both]"
                  style={{ animationDelay: "520ms" }}
                >
                  {/* Highlighted USP — Plan with AI */}
                  <a
                    href={primaryHref}
                    className="group relative z-10 inline-flex items-center gap-2 h-12 px-6 rounded-full text-[14px] font-medium overflow-hidden transition shadow-[0_10px_30px_-10px_rgba(244,180,90,0.7)] hover:shadow-[0_14px_40px_-10px_rgba(244,180,90,0.9)]"
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
                    <span aria-hidden className="relative inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px]" style={{ background: "oklch(0.18 0.012 60)", color: "oklch(0.92 0.06 70)" }}>✦</span>
                    <span className="relative">{primaryLabel}</span>
                    <span aria-hidden className="relative transition-transform group-hover:translate-x-0.5">→</span>
                    <span className="relative ml-1 hidden sm:inline text-[10px] tracking-[0.18em] uppercase px-1.5 py-0.5 rounded-full" style={{ background: "rgba(38, 32, 28, 0.1)", color: "rgba(38, 32, 28, 0.7)" }}>
                      New
                    </span>
                  </a>

                  <a
                    href={secondaryHref}
                    className="inline-flex items-center gap-2 h-12 px-6 rounded-full border border-white/30 text-white text-[14px] hover:bg-white/10 transition"
                  >
                    {secondaryLabel}
                  </a>

                  <button
                    type="button"
                    onClick={play}
                    className="inline-flex items-center gap-2 h-12 pl-3 pr-5 rounded-full bg-white/10 border border-white/20 text-white text-[14px] hover:bg-white/20 transition backdrop-blur"
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[color:var(--ink)]">
                      <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden>
                        <path d="M0 0 L10 6 L0 12 Z" />
                      </svg>
                    </span>
                    Watch film
                  </button>
                </div>

                {children && <div className="mt-10">{children}</div>}
              </div>

              {/* Right: video card */}
              <div
                className="lg:col-span-5 animate-[krtiv-rise_1200ms_cubic-bezier(0.22,1,0.36,1)_both]"
                style={{ animationDelay: "640ms" }}
              >
                <div className="relative rounded-[22px] overflow-hidden bg-black/40 ring-1 ring-white/15 backdrop-blur-md shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
                  <div className="relative aspect-video">
                    {videoSlot ? (
                      <div className="absolute inset-0 z-0 [&>*]:w-full [&>*]:h-full [&_.video-player-root]:h-full">
                        {videoSlot}
                      </div>
                    ) : (
                      <>
                        {videoSrc ? (
                          <video
                            ref={videoRef}
                            src={videoSrc}
                            poster={poster}
                            playsInline
                            preload="metadata"
                            onClick={play}
                            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                          />
                        ) : (
                          <img
                            src={poster}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                        {!playing && (
                          <button
                            type="button"
                            onClick={play}
                            aria-label="Play film"
                            className="absolute inset-0 flex items-center justify-center group"
                          >
                            <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/30 transition group-hover:from-black/65" />
                            <span className="relative inline-flex w-16 h-16 md:w-20 md:h-20 items-center justify-center rounded-full bg-white/95 text-[color:var(--ink)] shadow-2xl transition group-hover:scale-105">
                              <svg width="18" height="22" viewBox="0 0 22 26" fill="currentColor" aria-hidden>
                                <path d="M2 2 L20 13 L2 24 Z" />
                              </svg>
                            </span>
                          </button>
                        )}
                        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase text-white/90 bg-black/40 backdrop-blur px-2.5 py-1 rounded-full">
                          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--saffron)] animate-pulse" />
                          Featured film
                        </div>
                      </>
                    )}
                  </div>

                  {/* Video title bar — always below the player so play icon stays unobstructed */}
                  <div className="px-4 md:px-5 py-4 flex items-center gap-3 bg-black/55 backdrop-blur border-t border-white/10">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-white truncate">{videoTitle}</p>
                      <p className="text-[11px] text-white/60">{videoMeta}</p>
                    </div>
                    {!hasLiveVideo && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setReaction(reaction === "up" ? null : "up")}
                        aria-pressed={reaction === "up"}
                        aria-label="Like"
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
                          reaction === "up"
                            ? "bg-[color:var(--saffron)] border-transparent text-[color:var(--ink)]"
                            : "border-white/20 text-white/80 hover:bg-white/10"
                        }`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M7 10v12" />
                          <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7V10l4.34-7.13A1.93 1.93 0 0 1 15 5.88Z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => setReaction(reaction === "down" ? null : "down")}
                        aria-pressed={reaction === "down"}
                        aria-label="Dislike"
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
                          reaction === "down"
                            ? "bg-white text-[color:var(--ink)] border-transparent"
                            : "border-white/20 text-white/80 hover:bg-white/10"
                        }`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M17 14V2" />
                          <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17v12l-4.34 7.13A1.93 1.93 0 0 1 9 18.12Z" />
                        </svg>
                      </button>
                    </div>
                    )}
                  </div>

                  {/* Explore Itinerary CTA */}
                  <a
                    href={exploreHref}
                    className="group flex items-center justify-between gap-3 px-5 py-4 bg-[color:var(--ivory)] text-[color:var(--ink)] hover:bg-white transition"
                  >
                    <span className="text-[13px] font-medium">{exploreLabel}</span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--ink)] text-white transition group-hover:translate-x-0.5">
                      →
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="relative pb-10 flex justify-center">
          <a
            href="#explore-by-categories"
            className="group flex flex-col items-center gap-2 text-white/70 hover:text-white transition"
          >
            <span className="text-[11px] tracking-[0.3em] uppercase">Scroll</span>
            <span className="block w-px h-10 bg-white/40 group-hover:bg-white transition" />
          </a>
        </div>
      </div>
    </section>
  );
}

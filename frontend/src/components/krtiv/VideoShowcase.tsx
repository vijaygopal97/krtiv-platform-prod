"use client";
import { useRef, useState } from "react";
import { ScrollReveal } from "./ScrollReveal";

type Props = {
  eyebrow?: string;
  title?: string;
  description?: string;
  videoSrc?: string;
  poster?: string;
  /**
   * Slot for the real <CategoryVideoWithEngagement /> from the SignPost API.
   * When provided, it replaces the built-in placeholder player so engagement
   * (likes / reactions / view counts) stays wired to the backend.
   */
  children?: React.ReactNode;
};

/**
 * Editorial video showcase. Drop the live SignPost component as `children`
 * to keep API-driven reactions; otherwise it renders a graceful poster
 * with a play overlay so the section never looks empty in previews.
 */
export function VideoShowcase({
  eyebrow = "Watch the film",
  title = "A moving portrait of Maharashtra.",
  description = "Short films from the road — the people, the ghats, the light at five.",
  videoSrc,
  poster = "/krtiv/hero-image.jpeg",
  children,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section
      id="watch"
      className="relative bg-[color:var(--ink)] text-white py-12 md:py-16 border-t border-white/10"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 items-end mb-12">
          <ScrollReveal className="md:col-span-7">
            <p className="eyebrow text-white/60">{eyebrow}</p>
            <h2 className="display-lg mt-4 text-balance">{title}</h2>
          </ScrollReveal>
          <ScrollReveal className="md:col-span-5" delay={120}>
            <p className="lede text-white/70">{description}</p>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div className="relative w-full aspect-video rounded-[20px] overflow-hidden bg-black ring-1 ring-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
            {children ? (
              // Live video from the SignPost API (CategoryVideoWithEngagement)
              <div className="absolute inset-0 [&>*]:w-full [&>*]:h-full">
                {children}
              </div>
            ) : (
              <>
                {videoSrc ? (
                  <video
                    ref={ref}
                    src={videoSrc}
                    poster={poster}
                    playsInline
                    preload="metadata"
                    onClick={toggle}
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
                    onClick={toggle}
                    aria-label="Play film"
                    className="absolute inset-0 flex items-center justify-center group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/30 transition group-hover:from-black/60" />
                    <span className="relative inline-flex w-20 h-20 md:w-24 md:h-24 items-center justify-center rounded-full bg-white/95 text-[color:var(--ink)] shadow-2xl transition group-hover:scale-105">
                      <svg
                        width="22"
                        height="26"
                        viewBox="0 0 22 26"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path d="M2 2 L20 13 L2 24 Z" />
                      </svg>
                    </span>
                    <span className="absolute bottom-6 left-6 text-[11px] tracking-[0.3em] uppercase text-white/80">
                      Featured film
                    </span>
                  </button>
                )}
              </>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

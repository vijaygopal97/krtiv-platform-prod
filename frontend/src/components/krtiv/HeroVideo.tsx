'use client';

import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

type Props = {
  src: string;
  poster: string;
  scrollY?: number;
  className?: string;
};

export type HeroVideoHandle = {
  toggleMute: () => boolean;
  isMuted: boolean;
  soundAvailable: boolean;
};

/**
 * Full-bleed hero background video — autoplay, muted, loop, playsInline, object-fit cover.
 */
const HeroVideoImpl = forwardRef<HeroVideoHandle, Props>(function HeroVideo(
  { src, poster, scrollY = 0, className = '' },
  ref
) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeSrc, setActiveSrc] = useState('');
  const [videoReady, setVideoReady] = useState(false);
  const [posterOnly, setPosterOnly] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const soundAvailable = !posterOnly && Boolean(activeSrc) && videoReady;

  const toggleMute = useCallback((): boolean => {
    const v = videoRef.current;
    if (!v || !soundAvailable) return isMuted;
    const next = !v.muted;
    v.muted = next;
    if (!next) {
      v.volume = 1;
      void v.play().catch(() => {
        v.muted = true;
        setIsMuted(true);
      });
    }
    setIsMuted(next);
    return next;
  }, [soundAvailable, isMuted]);

  useImperativeHandle(
    ref,
    () => ({
      toggleMute,
      isMuted,
      soundAvailable,
    }),
    [toggleMute, isMuted, soundAvailable]
  );

  useEffect(() => {
    setIsMuted(true);
  }, [src]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) {
      setActiveSrc(src);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActiveSrc(src);
          io.disconnect();
        }
      },
      { rootMargin: '100px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !activeSrc || posterOnly) return;

    v.muted = isMuted;
    v.playsInline = true;

    // Whether the video is currently allowed/expected to be playing. We never
    // pause intentionally except when off-screen or the tab is hidden, so any
    // other pause is treated as an unwanted browser/compositor pause and undone.
    let visible = true;
    let firstPlayDone = false;

    const tryPlay = () => {
      if (!visible || document.hidden) return;
      if (!v.paused) return;
      const p = v.play();
      if (p && typeof p.catch === 'function') {
        p.then(() => {
          firstPlayDone = true;
        }).catch(() => {
          // Autoplay rejected while muted is rare; fall back to poster only
          // if we never managed to start at all.
          if (!firstPlayDone) setPosterOnly(true);
        });
      }
    };

    const onReady = () => {
      setVideoReady(true);
      tryPlay();
    };
    const onPlaying = () => {
      firstPlayDone = true;
      setVideoReady(true);
    };
    // Resume immediately if the browser pauses us for any non-intentional reason.
    const onPause = () => {
      tryPlay();
    };
    const onVisibility = () => {
      if (document.hidden) {
        v.pause();
      } else {
        tryPlay();
      }
    };

    v.addEventListener('canplay', onReady);
    v.addEventListener('loadeddata', onReady);
    v.addEventListener('playing', onPlaying);
    v.addEventListener('pause', onPause);
    document.addEventListener('visibilitychange', onVisibility);

    // Keep playing only while on-screen; pause when scrolled fully away.
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting);
        if (visible) tryPlay();
        else v.pause();
      },
      { threshold: 0.01 }
    );
    io.observe(v);

    if (v.readyState >= 3) {
      setVideoReady(true);
    }
    tryPlay();

    return () => {
      v.removeEventListener('canplay', onReady);
      v.removeEventListener('loadeddata', onReady);
      v.removeEventListener('playing', onPlaying);
      v.removeEventListener('pause', onPause);
      document.removeEventListener('visibilitychange', onVisibility);
      io.disconnect();
    };
  }, [activeSrc, posterOnly, isMuted]);

  const showPoster = posterOnly || !activeSrc || !videoReady;

  return (
    <div
      ref={wrapRef}
      className={`hero-video absolute inset-0 z-0 min-h-[100svh] overflow-hidden ${className}`}
      style={{ transform: `translate3d(0, ${scrollY * 0.35}px, 0)` }}
      aria-hidden
    >
      <img
        src={poster}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          showPoster ? 'opacity-100' : 'opacity-0'
        }`}
        decoding="async"
      />
      {!posterOnly && activeSrc ? (
        <video
          ref={videoRef}
          className="hero-video__el absolute inset-0 w-full h-full object-cover brightness-[1.06] contrast-[1.03] saturate-[1.05]"
          autoPlay
          muted={isMuted}
          loop
          playsInline
          preload="none"
          poster={poster}
          onError={() => setPosterOnly(true)}
        >
          <source src={activeSrc} type="video/mp4" />
        </video>
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/35 md:from-black/35 md:via-black/10 md:to-black/30" />
      <div
        className="absolute inset-0 opacity-50 md:opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 85% 70% at 50% 45%, transparent 0%, rgba(0,0,0,0.25) 100%)',
        }}
      />
    </div>
  );
});

HeroVideoImpl.displayName = 'HeroVideo';

/**
 * Memoized so the hero's frequent scroll-driven re-renders (pin progress, etc.)
 * never re-render the video element. In pinned mode scrollY is constant (0), so
 * the video DOM stays untouched and playback is never interrupted.
 */
export const HeroVideo = memo(HeroVideoImpl);

type SoundToggleProps = {
  controlRef: React.RefObject<HeroVideoHandle | null>;
  className?: string;
};

/** Bottom-right hero sound control — sits above hero copy (z-20). */
export function HeroVideoSoundToggle({ controlRef, className = '' }: SoundToggleProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      const ctl = controlRef.current;
      if (ctl?.soundAvailable) {
        setEnabled(true);
        setIsMuted(ctl.isMuted);
        window.clearInterval(id);
      }
    }, 300);
    return () => window.clearInterval(id);
  }, [controlRef]);

  return (
    <button
      type="button"
      disabled={!enabled}
      onClick={() => {
        const next = controlRef.current?.toggleMute();
        if (typeof next === 'boolean') setIsMuted(next);
      }}
      aria-pressed={!isMuted}
      aria-label={isMuted ? 'Turn hero video sound on' : 'Turn hero video sound off'}
      className={`inline-flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 md:w-12 md:h-12 rounded-full border border-white/35 bg-black/55 text-white shadow-lg backdrop-blur-md transition hover:bg-black/70 hover:border-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 disabled:opacity-50 disabled:pointer-events-none ${className}`}
    >
      {isMuted ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M11 5L6 9H3v6h3l5 4V5z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M15.5 8.5l5 5M20.5 8.5l-5 5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M11 5L6 9H3v6h3l5 4V5z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M15.5 9.5a4.5 4.5 0 010 5M17.8 7.2a7.5 7.5 0 010 9.6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  src: string;
  poster: string;
  scrollY?: number;
  className?: string;
};

/**
 * Full-bleed hero background: autoplay, muted, loop, playsInline.
 * Falls back to poster image if video fails to load.
 */
export function HeroBackgroundVideo({ src, poster, scrollY = 0, className = '' }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [usePosterOnly, setUsePosterOnly] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || usePosterOnly) return;
    v.muted = true;
    v.playsInline = true;
    const play = () => {
      v.play().catch(() => setUsePosterOnly(true));
    };
    if (v.readyState >= 2) play();
    else v.addEventListener('loadeddata', play, { once: true });
    return () => v.removeEventListener('loadeddata', play);
  }, [src, usePosterOnly]);

  return (
    <div
      className={`absolute inset-0 z-0 min-h-[100svh] will-change-transform overflow-hidden ${className}`}
      style={{ transform: `translate3d(0, ${scrollY * 0.35}px, 0)` }}
      aria-hidden
    >
      <div className="hero-bg-stack absolute inset-0 min-h-[100svh]">
        {usePosterOnly ? (
          <img src={poster} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setUsePosterOnly(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/38 via-black/24 to-black/50 md:from-black/28 md:via-black/16 md:to-black/36" />
        <div
          className="absolute inset-0 opacity-35 md:opacity-25"
          style={{
            background:
              'radial-gradient(ellipse at 30% 40%, transparent 0%, rgba(0,0,0,0.42) 80%)',
          }}
        />
      </div>
    </div>
  );
}

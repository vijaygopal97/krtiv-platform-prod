"use client";

import { useEffect, useRef, useState } from "react";
import {
  getHeroFocalStyles,
  isMobileHeroViewport,
} from "@/lib/heroMobileFocalPosition";

type Props = {
  src: string;
  alt: string;
  focalX?: number;
  focalY?: number;
  kenBurnsClass?: string;
  loading?: "eager" | "lazy";
};

export function HeroFocalImage({
  src,
  alt,
  focalX = 50,
  focalY = 50,
  kenBurnsClass = "",
  loading = "lazy",
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameSize, setFrameSize] = useState({ w: 0, h: 0 });
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 });
  const [viewportW, setViewportW] = useState(0);
  const [isLandscape, setIsLandscape] = useState(false);
  const [displaySrc, setDisplaySrc] = useState(src);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (src === displaySrc) return;
    setOpacity(0);
    let cancelled = false;
    const preload = new window.Image();
    preload.onload = () => {
      if (cancelled) return;
      setDisplaySrc(src);
      requestAnimationFrame(() => setOpacity(1));
    };
    preload.onerror = () => {
      if (cancelled) return;
      setDisplaySrc(src);
      setOpacity(1);
    };
    preload.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, displaySrc]);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const update = () => {
      setFrameSize({ w: el.clientWidth, h: el.clientHeight });
      setViewportW(window.innerWidth);
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("orientationchange", update, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  const isMobile = isMobileHeroViewport(viewportW || frameSize.w);
  const { objectPosition, transformOrigin, useMobileFocal } = getHeroFocalStyles({
    containerW: frameSize.w,
    containerH: frameSize.h,
    imageW: imageSize.w,
    imageH: imageSize.h,
    focalX,
    focalY,
    isMobile,
    isLandscape,
  });

  const motionClass = useMobileFocal
    ? "hero-focal-mobile-motion"
    : kenBurnsClass;

  return (
    <div ref={frameRef} className="hero-focal-frame absolute inset-0 overflow-hidden">
      <img
        src={displaySrc}
        alt={alt}
        className={`hero-focal-image object-cover w-full h-full md:h-[120%] ${motionClass}`}
        style={{
          objectPosition,
          ...(useMobileFocal ? { transformOrigin } : {}),
          opacity,
          transition: 'opacity 420ms ease',
        }}
        loading={loading}
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth && img.naturalHeight) {
            setImageSize({ w: img.naturalWidth, h: img.naturalHeight });
          }
        }}
      />
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import {
  getHeroFocalStyles,
  isMobileHeroViewport,
} from "@/lib/heroFocalPosition";

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

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const update = () => {
      setFrameSize({ w: el.clientWidth, h: el.clientHeight });
      setViewportW(window.innerWidth);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
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
  });

  const motionClass = useMobileFocal
    ? "hero-focal-mobile-motion"
    : kenBurnsClass;

  return (
    <div ref={frameRef} className="absolute inset-0 overflow-hidden">
      <img
        src={src}
        alt={alt}
        className={`hero-focal-image w-full h-full object-cover md:h-[120%] ${motionClass}`}
        style={{
          objectPosition,
          ...(useMobileFocal ? { transformOrigin } : {}),
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

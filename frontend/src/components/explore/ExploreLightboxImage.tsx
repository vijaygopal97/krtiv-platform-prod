'use client';

import { useEffect, useRef, useState } from 'react';

const MIN_SCALE = 1;
const MAX_SCALE = 4;

function clampScale(s: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));
}

function touchDistance(touches: TouchList): number {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

function focalPoint(el: HTMLElement, clientX: number, clientY: number) {
  const rect = el.getBoundingClientRect();
  return {
    x: clientX - (rect.left + rect.width / 2),
    y: clientY - (rect.top + rect.height / 2),
  };
}

function touchMidpoint(el: HTMLElement, touches: TouchList) {
  const mx = (touches[0].clientX + touches[1].clientX) / 2;
  const my = (touches[0].clientY + touches[1].clientY) / 2;
  return focalPoint(el, mx, my);
}

/** Keep the point under the focal pixel fixed while scaling (Instagram-style). */
function translateForScale(
  focalX: number,
  focalY: number,
  oldScale: number,
  newScale: number,
  oldTx: number,
  oldTy: number,
) {
  const ratio = newScale / oldScale;
  return {
    x: focalX - (focalX - oldTx) * ratio,
    y: focalY - (focalY - oldTy) * ratio,
  };
}

type Props = {
  src: string;
  alt: string;
  onError?: () => void;
  onSwipePrev?: () => void;
  onSwipeNext?: () => void;
};

export function ExploreLightboxImage({ src, alt, onError, onSwipePrev, onSwipeNext }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const translateRef = useRef({ x: 0, y: 0 });
  const pinchStart = useRef<{
    dist: number;
    scale: number;
    tx: number;
    ty: number;
    focalX: number;
    focalY: number;
  } | null>(null);
  const panStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const swipeStartX = useRef<number | null>(null);
  const lastTapRef = useRef(0);
  const isPinching = useRef(false);

  const paint = (s: number, tx: number, ty: number) => {
    const snap = s <= 1.02 ? 1 : clampScale(s);
    const snapTx = snap === 1 ? 0 : tx;
    const snapTy = snap === 1 ? 0 : ty;
    scaleRef.current = snap;
    translateRef.current = { x: snapTx, y: snapTy };
    if (layerRef.current) {
      layerRef.current.style.transform = `translate3d(${snapTx}px, ${snapTy}px, 0) scale(${snap})`;
    }
    setScale(snap);
    setTranslate({ x: snapTx, y: snapTy });
  };

  useEffect(() => {
    paint(1, 0, 0);
  }, [src]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const focal = focalPoint(el, e.clientX, e.clientY);
      const oldScale = scaleRef.current;
      const delta = e.deltaY > 0 ? -0.12 : 0.12;
      const newScale = clampScale(oldScale + delta);
      const { x, y } = translateForScale(
        focal.x,
        focal.y,
        oldScale,
        newScale,
        translateRef.current.x,
        translateRef.current.y,
      );
      paint(newScale, x, y);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        isPinching.current = true;
        const mid = touchMidpoint(el, e.touches);
        pinchStart.current = {
          dist: touchDistance(e.touches),
          scale: scaleRef.current,
          tx: translateRef.current.x,
          ty: translateRef.current.y,
          focalX: mid.x,
          focalY: mid.y,
        };
        panStart.current = null;
        swipeStartX.current = null;
        return;
      }
      if (e.touches.length === 1) {
        pinchStart.current = null;
        if (scaleRef.current > 1.02) {
          panStart.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            tx: translateRef.current.x,
            ty: translateRef.current.y,
          };
          swipeStartX.current = null;
        } else {
          swipeStartX.current = e.touches[0].clientX;
          panStart.current = null;
        }
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchStart.current) {
        e.preventDefault();
        const mid = touchMidpoint(el, e.touches);
        const dist = touchDistance(e.touches);
        const newScale = clampScale(pinchStart.current.scale * (dist / pinchStart.current.dist));
        const { x, y } = translateForScale(
          mid.x,
          mid.y,
          pinchStart.current.scale,
          newScale,
          pinchStart.current.tx,
          pinchStart.current.ty,
        );
        paint(newScale, x, y);
        return;
      }
      if (e.touches.length === 1 && panStart.current && scaleRef.current > 1.02) {
        e.preventDefault();
        const dx = e.touches[0].clientX - panStart.current.x;
        const dy = e.touches[0].clientY - panStart.current.y;
        const tx = panStart.current.tx + dx;
        const ty = panStart.current.ty + dy;
        translateRef.current = { x: tx, y: ty };
        if (layerRef.current) {
          layerRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scaleRef.current})`;
        }
        setTranslate({ x: tx, y: ty });
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length >= 2) return;
      if (e.touches.length === 1) {
        pinchStart.current = null;
        isPinching.current = false;
        return;
      }

      isPinching.current = false;
      pinchStart.current = null;

      if (scaleRef.current <= 1.02) {
        paint(1, 0, 0);
      }

      if (swipeStartX.current != null && scaleRef.current <= 1.02) {
        const endX = e.changedTouches[0]?.clientX;
        if (endX != null) {
          const delta = endX - swipeStartX.current;
          if (delta > 72) onSwipePrev?.();
          else if (delta < -72) onSwipeNext?.();
        }
      }

      panStart.current = null;
      swipeStartX.current = null;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [src, onSwipePrev, onSwipeNext]);

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPinching.current) return;
    const el = stageRef.current;
    if (!el) return;

    const now = Date.now();
    if (now - lastTapRef.current < 320) {
      const focal = focalPoint(el, e.clientX, e.clientY);
      if (scaleRef.current > 1.02) {
        paint(1, 0, 0);
      } else {
        const newScale = 2.5;
        const { x, y } = translateForScale(focal.x, focal.y, 1, newScale, 0, 0);
        paint(newScale, x, y);
      }
      lastTapRef.current = 0;
      return;
    }
    lastTapRef.current = now;
  };

  return (
    <div ref={stageRef} className="explore-lightbox__zoom-stage" onClick={handleTap}>
      <div
        ref={layerRef}
        className="explore-lightbox__zoom-layer"
        style={{
          transform: `translate3d(${translate.x}px, ${translate.y}px, 0) scale(${scale})`,
        }}
      >
        <img
          src={src}
          alt={alt}
          className="explore-lightbox__img"
          draggable={false}
          decoding="async"
          onError={onError}
        />
      </div>
    </div>
  );
}

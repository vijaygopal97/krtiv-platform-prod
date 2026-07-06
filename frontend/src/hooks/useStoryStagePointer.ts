'use client';

import { useCallback, useRef } from 'react';

type PointerState = {
  id: number;
  x: number;
  y: number;
  t: number;
  moved: boolean;
};

type Options = {
  stageRef: React.RefObject<HTMLElement | null>;
  onTapLeft: () => void;
  onTapRight: () => void;
  onHoldStart: () => void;
  onHoldEnd: () => void;
};

const SWIPE_PX = 48;
const MOVE_PX = 10;
const TAP_MS = 450;

/**
 * Unified pointer handling for story stage (WebView-safe, no click+touch double fire).
 */
export function useStoryStagePointer({
  stageRef,
  onTapLeft,
  onTapRight,
  onHoldStart,
  onHoldEnd,
}: Options) {
  const ptr = useRef<PointerState | null>(null);
  const lastNavAt = useRef(0);
  const onTapLeftRef = useRef(onTapLeft);
  const onTapRightRef = useRef(onTapRight);
  onTapLeftRef.current = onTapLeft;
  onTapRightRef.current = onTapRight;

  const nav = useCallback((dir: 'left' | 'right') => {
    const now = Date.now();
    if (now - lastNavAt.current < 280) return;
    lastNavAt.current = now;
    if (dir === 'left') onTapLeftRef.current();
    else onTapRightRef.current();
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const el = stageRef.current;
      if (!el) return;

      ptr.current = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        t: Date.now(),
        moved: false,
      };
      onHoldStart();
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* WebView may block capture */
      }
    },
    [stageRef, onHoldStart],
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const p = ptr.current;
    if (!p || p.id !== e.pointerId) return;
    if (
      Math.abs(e.clientX - p.x) > MOVE_PX ||
      Math.abs(e.clientY - p.y) > MOVE_PX
    ) {
      p.moved = true;
    }
  }, []);

  const finishPointer = useCallback(
    (e: React.PointerEvent) => {
      const p = ptr.current;
      if (!p || p.id !== e.pointerId) return;
      ptr.current = null;
      onHoldEnd();

      const el = stageRef.current;
      try {
        el?.releasePointerCapture(e.pointerId);
      } catch {
        /* ok */
      }

      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      const dt = Date.now() - p.t;

      if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy)) {
        nav(dx < 0 ? 'right' : 'left');
        return;
      }

      if (!p.moved && dt < TAP_MS && el) {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        if (relX < rect.width * 0.32) nav('left');
        else nav('right');
      }
    },
    [stageRef, onHoldEnd, nav],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => finishPointer(e),
    [finishPointer],
  );

  const onPointerCancel = useCallback(
    (e: React.PointerEvent) => {
      finishPointer(e);
    },
    [finishPointer],
  );

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  };
}

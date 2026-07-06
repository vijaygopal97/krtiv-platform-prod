'use client';

import { useCallback, useRef, type RefObject } from 'react';
import type { TapGuard } from '@/hooks/useTravelStoriesTapGuard';

const TAP_MOVE_PX = 10;
const TAP_MAX_MS = 300;

type Start = { x: number; y: number; t: number };

/**
 * Opens story only on intentional tap (not scroll or horizontal carousel swipe).
 */
export function useIntentTap(
  onTap: () => void,
  guardRef?: RefObject<TapGuard | null>,
) {
  const startRef = useRef<Start | null>(null);
  const blockedRef = useRef(false);
  const lockRef = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    startRef.current = { x: e.clientX, y: e.clientY, t: Date.now() };
    blockedRef.current = guardRef?.current?.block ?? false;
  }, [guardRef]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const s = startRef.current;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    if (adx > TAP_MOVE_PX || ady > TAP_MOVE_PX) {
      blockedRef.current = true;
    }
    if (ady > adx && ady > TAP_MOVE_PX) {
      blockedRef.current = true;
    }
    if (adx > ady && adx > TAP_MOVE_PX) {
      blockedRef.current = true;
    }
  }, []);

  const fireIfTap = useCallback(
    (e: React.SyntheticEvent, clientX: number, clientY: number) => {
      e.stopPropagation();
      const s = startRef.current;
      startRef.current = null;
      if (!s || blockedRef.current || guardRef?.current?.block) return;

      const adx = Math.abs(clientX - s.x);
      const ady = Math.abs(clientY - s.y);
      const dt = Date.now() - s.t;

      if (adx > TAP_MOVE_PX || ady > TAP_MOVE_PX) return;
      if (dt > TAP_MAX_MS) return;
      if (ady > adx && ady > 4) return;

      if (lockRef.current) return;
      lockRef.current = true;
      window.setTimeout(() => {
        lockRef.current = false;
      }, 400);
      onTap();
    },
    [guardRef, onTap],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      fireIfTap(e, e.clientX, e.clientY);
    },
    [fireIfTap],
  );

  const onPointerCancel = useCallback(() => {
    startRef.current = null;
    blockedRef.current = true;
  }, []);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      const ne = e.nativeEvent;
      if (ne instanceof PointerEvent && ne.pointerType !== 'mouse') return;
      if (!startRef.current) {
        if (e.detail === 0) {
          if (lockRef.current) return;
          lockRef.current = true;
          window.setTimeout(() => {
            lockRef.current = false;
          }, 400);
          onTap();
        }
        return;
      }
      fireIfTap(e, e.clientX, e.clientY);
    },
    [fireIfTap, onTap],
  );

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onClick,
  };
}

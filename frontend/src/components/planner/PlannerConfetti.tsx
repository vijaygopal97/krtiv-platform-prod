'use client';

import { useEffect, useState, type CSSProperties } from 'react';

const COLORS = ['#EAA048', '#B5562D', '#2F473E', '#F4E8D8', '#C45C26'];

type Props = {
  active: boolean;
  burstKey: number;
};

export function PlannerConfetti({ active, burstKey }: Props) {
  const [pieces, setPieces] = useState<
    { id: number; left: number; color: string; tx: number; ty: number; dur: number }[]
  >([]);

  useEffect(() => {
    if (!active || burstKey === 0) return;
    const next = Array.from({ length: 36 }, (_, i) => ({
      id: burstKey * 100 + i,
      left: 15 + Math.random() * 70,
      color: COLORS[i % COLORS.length]!,
      tx: (Math.random() - 0.5) * 120,
      ty: 80 + Math.random() * 40,
      dur: 1.8 + Math.random() * 1.2,
    }));
    setPieces(next);
    const t = window.setTimeout(() => setPieces([]), 3200);
    return () => window.clearTimeout(t);
  }, [active, burstKey]);

  if (pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[45] overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="planner-confetti-piece"
          style={
            {
              left: `${p.left}%`,
              top: '20%',
              backgroundColor: p.color,
              '--tx': `${p.tx}px`,
              '--ty': `${p.ty}vh`,
              '--fall-duration': `${p.dur}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

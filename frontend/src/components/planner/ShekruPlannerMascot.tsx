'use client';

import { useEffect, useState } from 'react';
import { ShekruLoader } from '@/components/krtiv/ShekruLoader';

export type MascotMode = 'idle' | 'celebrate' | 'walking';

const DEFAULT_MESSAGES = [
  'Great choice!',
  "Let's explore Maharashtra!",
  'Your journey starts here!',
] as const;

type Props = {
  mode: MascotMode;
  message?: string | null;
  celebrateToken?: number;
};

export function ShekruPlannerMascot({ mode, message, celebrateToken = 0 }: Props) {
  const [bubble, setBubble] = useState<string | null>(null);

  useEffect(() => {
    if (celebrateToken === 0 || mode !== 'celebrate') return;
    const text =
      message ??
      DEFAULT_MESSAGES[celebrateToken % DEFAULT_MESSAGES.length] ??
      DEFAULT_MESSAGES[0];
    setBubble(text);
    const t = window.setTimeout(() => setBubble(null), 2800);
    return () => window.clearTimeout(t);
  }, [celebrateToken, mode, message]);

  const modeClass =
    mode === 'walking'
      ? 'shekru-planner-mascot--walking'
      : mode === 'celebrate'
        ? 'shekru-planner-mascot--celebrate'
        : 'shekru-planner-mascot--idle';

  return (
    <div className="shekru-planner-mascot" aria-live="polite">
      {bubble ? (
        <div className="shekru-planner-mascot__bubble" role="status">
          {bubble}
        </div>
      ) : null}
      <div className={`shekru-planner-mascot__sprite ${modeClass}`}>
        <ShekruLoader
          variant={mode === 'walking' ? 'walking' : 'idle'}
          label="Shekru, Maharashtra travel mascot"
        />
      </div>
    </div>
  );
}

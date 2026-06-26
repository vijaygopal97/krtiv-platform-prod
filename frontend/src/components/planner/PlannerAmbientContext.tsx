'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type Ctx = {
  selectedInterests: string[];
  setSelectedInterests: (v: string[]) => void;
  flashInterest: (label: string) => void;
  flashToken: number;
  lastFlashInterest: string | null;
};

const PlannerAmbientContext = createContext<Ctx | null>(null);

export function PlannerAmbientProvider({ children }: { children: ReactNode }) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [flashToken, setFlashToken] = useState(0);
  const [lastFlashInterest, setLastFlashInterest] = useState<string | null>(null);

  const flashInterest = useCallback((label: string) => {
    setLastFlashInterest(label);
    setFlashToken((t) => t + 1);
  }, []);

  const value = useMemo(
    () => ({
      selectedInterests,
      setSelectedInterests,
      flashInterest,
      flashToken,
      lastFlashInterest,
    }),
    [selectedInterests, flashInterest, flashToken, lastFlashInterest]
  );

  return <PlannerAmbientContext.Provider value={value}>{children}</PlannerAmbientContext.Provider>;
}

export function usePlannerAmbient() {
  const ctx = useContext(PlannerAmbientContext);
  if (!ctx) {
    return {
      selectedInterests: [] as string[],
      setSelectedInterests: () => {},
      flashInterest: () => {},
      flashToken: 0,
      lastFlashInterest: null as string | null,
    };
  }
  return ctx;
}

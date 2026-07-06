'use client';

import { useEffect, useState } from 'react';
import GeneratorForm from '@/components/dashboard/GeneratorForm';
import type { ItineraryJobRequest } from '@/lib/signpostApi';

type Props = {
  onSubmit: (payload: ItineraryJobRequest) => void;
  disabled?: boolean;
};

export default function BuilderPlannerForm({ onSubmit, disabled }: Props) {
  const [initialLocations, setInitialLocations] = useState('');
  const [initialTitle, setInitialTitle] = useState('');

  useEffect(() => {
    const dest = sessionStorage.getItem('dash-prefill-destination');
    if (dest) {
      setInitialLocations(dest);
      setInitialTitle(`${dest} trip`);
      sessionStorage.removeItem('dash-prefill-destination');
    }
  }, []);

  return (
    <GeneratorForm
      onSubmit={onSubmit}
      disabled={disabled}
      initialTitle={initialTitle}
      initialLocations={initialLocations}
    />
  );
}

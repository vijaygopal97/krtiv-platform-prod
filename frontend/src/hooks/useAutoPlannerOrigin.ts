'use client';

import { useEffect, useState } from 'react';
import {
  TRAVEL_SEASONS,
  detectOriginCityFromIp,
  inferTravelSeasonFromDate,
} from '@/lib/plannerTripDetails';

/** Auto-detect starting city (IP) and travel season on planner mount. */
export function useAutoPlannerOrigin() {
  const [originCity, setOriginCity] = useState('Mumbai');
  const [travelSeason, setTravelSeason] = useState<string>(inferTravelSeasonFromDate());
  const [detectingOrigin, setDetectingOrigin] = useState(true);
  const [originFromIp, setOriginFromIp] = useState(false);

  useEffect(() => {
    let cancelled = false;
    detectOriginCityFromIp()
      .then((city) => {
        if (cancelled || !city.trim()) return;
        setOriginCity(city.trim());
        setOriginFromIp(true);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setDetectingOrigin(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    originCity,
    setOriginCity,
    travelSeason,
    setTravelSeason,
    detectingOrigin,
    originFromIp,
    travelSeasonOptions: TRAVEL_SEASONS,
  };
}

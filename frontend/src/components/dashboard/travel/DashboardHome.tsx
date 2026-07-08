'use client';

import { useCallback, useState } from 'react';
import type { ItineraryJobRequest } from '@/lib/signpostApi';
import type { SavedItineraryRecord } from '@/lib/myItinerariesApi';
import type { User } from '@/services/authService';
import { useSavedPlacesList } from '@/hooks/useSavedPlace';
import { SiteFooter } from '@/components/krtiv/SiteFooter';
import DashboardHeader from './DashboardHeader';
import QuickActions from './QuickActions';
import ContinueYourTrips from './ContinueYourTrips';
import UpcomingTrips from './UpcomingTrips';
import SavedPlaces from './SavedPlaces';
import AIPlannerWidget, { type PlannerPrefill } from './AIPlannerWidget';
import RecentActivity from './RecentActivity';
import ProfileSidebar from './ProfileSidebar';
import AIAssistant from './AIAssistant';
import WeatherWidget from './WeatherWidget';
import RecommendedDestinations from './RecommendedDestinations';
import TravelCollections from './TravelCollections';
import type { DashTab } from './DashboardNav';

type Props = {
  user: User;
  savedItems: SavedItineraryRecord[];
  favorites: SavedItineraryRecord[];
  loadingSaved: boolean;
  onTabChange: (tab: DashTab) => void;
  onGenerate: (payload: ItineraryJobRequest) => void;
  isGenerating?: boolean;
};

export default function DashboardHome({
  user,
  savedItems,
  favorites,
  loadingSaved,
  onTabChange,
  onGenerate,
  isGenerating,
}: Props) {
  const savedPlaces = useSavedPlacesList();
  const savedPlaceCount = savedPlaces.length;
  const [plannerPrefill, setPlannerPrefill] = useState<PlannerPrefill | null>(null);

  const scrollToPlanner = useCallback(() => {
    requestAnimationFrame(() => {
      document.getElementById('dash-ai-planner')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const handlePlanFromPlace = useCallback(
    (req: { destination: string; travelStyle: string; autoGenerate: boolean }) => {
      setPlannerPrefill({
        destination: req.destination,
        travelStyle: req.travelStyle,
        autoGenerate: req.autoGenerate,
        nonce: Date.now(),
      });
      scrollToPlanner();
    },
    [scrollToPlanner],
  );

  const stashTripPrefill = (destination: string) => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('dash-prefill-destination', destination);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto mobile-scroll-pad">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 md:py-8 space-y-6">
        <DashboardHeader userName={user.name} onCreateTrip={() => onTabChange('builder')} />
        <QuickActions onNavigate={onTabChange} />

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
          <div className="space-y-6 min-w-0 xl:max-w-none">
            <ContinueYourTrips
              items={savedItems}
              loading={loadingSaved}
              onContinue={() => onTabChange('saved')}
              onOpenSaved={() => onTabChange('saved')}
            />
            <UpcomingTrips items={savedItems} loading={loadingSaved} onView={() => onTabChange('saved')} />
            <SavedPlaces
              onPlanWithAI={handlePlanFromPlace}
              onAddToTrip={(dest) => {
                stashTripPrefill(dest);
                onTabChange('builder');
              }}
              onAddToItinerary={(dest) => {
                stashTripPrefill(dest);
                onTabChange('builder');
              }}
            />
            <AIPlannerWidget onGenerate={onGenerate} disabled={isGenerating} prefill={plannerPrefill} />
            <RecentActivity itineraries={savedItems} />
          </div>

          <aside className="space-y-4 xl:sticky xl:top-20">
            <ProfileSidebar user={user} placesSaved={savedPlaceCount} />
            <AIAssistant onNavigate={onTabChange} />
            <WeatherWidget />
          </aside>
        </div>

        <RecommendedDestinations />
        <TravelCollections />
      </div>
      <SiteFooter />
    </div>
  );
}

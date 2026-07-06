'use client';

import { motion } from 'framer-motion';
import SmartKeywordItinerary from '@/components/itinerary/SmartKeywordItinerary';
import type { ItineraryJobRequest } from '@/lib/signpostApi';
import type { SavedItineraryRecord } from '@/lib/myItinerariesApi';
import type { User } from '@/services/authService';
import { DashboardHero } from './DashboardHero';
import { DashboardAIPlanner } from './DashboardAIPlanner';
import { DashboardCategoryGrid } from './DashboardCategoryGrid';
import { DashboardStatsCards } from './DashboardStatsCards';
import { DashboardContinuePlanning } from './DashboardContinuePlanning';
import { DashboardDestinationGrid } from './DashboardDestinationGrid';
import { DashboardExperienceCarousel } from './DashboardExperienceCarousel';
import { DashboardAISuggestions } from './DashboardAISuggestions';
import { DashboardActivityTimeline } from './DashboardActivityTimeline';
import { DashboardProfileCard } from './DashboardProfileCard';

type Props = {
  user: User;
  savedItems: SavedItineraryRecord[];
  isGenerating: boolean;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  activeFilter: string | null;
  onFilterClick: (filter: string) => void;
  selectedCategory: string | null;
  onCategorySelect: (id: string) => void;
  onGenerate: (payload: ItineraryJobRequest) => void;
  onOpenSaved: () => void;
  onOpenSmart: () => void;
  plannerSeed?: string;
  plannerStyle?: string;
};

export function DashboardHome({
  user,
  savedItems,
  isGenerating,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterClick,
  selectedCategory,
  onCategorySelect,
  onGenerate,
  onOpenSaved,
  onOpenSmart,
  plannerSeed,
  plannerStyle,
}: Props) {
  const savedCount = savedItems.length;
  const favoritesCount = savedItems.filter((i) => i.isFavorite).length;
  const explored = new Set(savedItems.map((i) => i.parsedSummary?.region).filter(Boolean)).size;

  return (
    <div className="pb-8">
      <DashboardHero
        userName={user.name}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        activeFilter={activeFilter}
        onFilterClick={onFilterClick}
      />

      <DashboardAIPlanner
        onSubmit={(p) => onGenerate(p)}
        disabled={isGenerating}
        initialDestination={plannerSeed || searchQuery || undefined}
        initialStyle={plannerStyle || activeFilter || undefined}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mt-12 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-0">
          <DashboardStatsCards
            tripsPlanned={savedCount}
            placesSaved={savedCount}
            destinationsExplored={Math.max(explored, savedCount > 0 ? explored : 3)}
            aiRecommendations={Math.max(4, favoritesCount + 2)}
          />
          <DashboardCategoryGrid selectedId={selectedCategory} onSelect={onCategorySelect} />
          <DashboardContinuePlanning items={savedItems} onContinue={onOpenSaved} />
          <DashboardDestinationGrid />
          <DashboardExperienceCarousel />
          <DashboardAISuggestions onOpenSmartPlanner={onOpenSmart} />
          <DashboardActivityTimeline items={savedItems} />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <DashboardProfileCard user={user} tripsCompleted={savedCount} />
          <motion.section
            className="lux-card p-6 md:p-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="eyebrow text-[color:var(--lux-primary)]">Smart tags</p>
            <h2 className="font-display-lux text-xl mt-2">Quick AI planner</h2>
            <p className="text-sm text-[color:var(--lux-muted)] mt-2 mb-4">
              Pick interest tags for a fast itinerary — same smart engine as before.
            </p>
            <div className="lux-panel-inset p-4 -mx-2">
              <SmartKeywordItinerary context="home" compact />
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

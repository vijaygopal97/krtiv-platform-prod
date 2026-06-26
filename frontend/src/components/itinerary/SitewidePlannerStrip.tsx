'use client';

import SmartKeywordItinerary from '@/components/itinerary/SmartKeywordItinerary';
import type { KeywordContext } from '@/lib/itineraryKeywords';

/** Compact planner block for static pages (about, contact, etc.). */
export function SitewidePlannerStrip({
  context = 'explore',
  heading = 'Generate your itinerary',
  subheading = 'Choose keywords, then click Generate My Itinerary.',
}: {
  context?: KeywordContext;
  heading?: string;
  subheading?: string;
}) {
  return (
    <SmartKeywordItinerary
      context={context}
      heading={heading}
      subheading={subheading}
      className="border-t hairline bg-white"
      compact
    />
  );
}

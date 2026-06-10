'use client';

import { useState } from 'react';
import Link from 'next/link';
import DayCard from './DayCard';

interface ItineraryTimelineProps {
  itineraryData: {
    days: Array<{
      day: number;
      location: string;
      image: string;
      flightInfo?: { from: string; price: string; duration: string };
      hotels?: Array<{ name: string; price: string; rating: string }>;
      activities: Array<{
        time: string;
        title: string;
        duration: string;
        description: string;
        details: string;
        icon: string;
      }>;
    }>;
  };
  /** Title from API (e.g. trip theme); when set, overrides default heading. */
  theme?: string;
  /** Subtitle from API (e.g. region); when set, overrides default description. */
  region?: string;
}

export default function ItineraryTimeline({ itineraryData, theme, region }: ItineraryTimelineProps) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const data = itineraryData?.days || [];
  const description = region || "An expertly crafted expedition through Maharashtra's majestic experiences";

  return (
    <section id="itinerary" className="relative py-20 px-4 md:px-8 lg:px-16 overflow-hidden">
      <div className="absolute inset-0 bg-pattern-warli opacity-30"></div>
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-6 py-2 bg-[#FF9933]/10 rounded-full border border-[#FF9933]/20">
            <span className="text-[#FF9933] font-bold text-sm tracking-wide">YOUR CURATED JOURNEY</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-4">
            {theme ? (
              theme
            ) : (
              <>
                3-Day Sahyadri
                <span className="font-bold" style={{
                  background: 'linear-gradient(135deg, #FF9933 0%, #ea580c 50%, #c2410c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}> Adventure</span>
              </>
            )}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#FF9933] via-[#D4AF37] to-[#FF9933] opacity-30"></div>
          <div className="space-y-12 md:space-y-24">
            {data.map((day, index) => (
              <DayCard
                key={day.day}
                day={day}
                index={index}
                isHovered={hoveredDay === day.day}
                onHover={() => setHoveredDay(day.day)}
                onLeave={() => setHoveredDay(null)}
              />
            ))}
          </div>
        </div>

        <div className="mt-16 p-8 bg-gradient-to-r from-orange-100 via-yellow-50 to-orange-100 rounded-3xl border border-orange-200 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-maharashtra rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-gray-900">Ready to Begin?</h3>
                <p className="text-gray-600">All accommodations, guides, and permits included</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-white rounded-full font-bold text-[#FF9933] border-2 border-[#FF9933]/20 hover:bg-orange-50 hover:border-[#FF9933]/40 transition-colors"
              >
                Build your own itinerary
              </Link>
              <span className="px-6 py-3 bg-white/80 rounded-full font-bold text-gray-700 border border-white/40">
                ₹24,999 per person
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

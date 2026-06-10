'use client';

import { useState } from 'react';
import ActivityCard from './ActivityCard';

interface DayCardProps {
  day: {
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
  };
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

export default function DayCard({ day, index, isHovered, onHover, onLeave }: DayCardProps) {
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null);
  const isEven = index % 2 === 0;

  return (
    <div className="space-y-6" onMouseEnter={onHover} onMouseLeave={onLeave}>
      <div
        className={`relative flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-start group rounded-2xl p-2 md:p-4 -m-2 md:-m-4 transition-shadow duration-300 ease-out ${
          isHovered
            ? 'shadow-[0_0_0_2px_rgba(255,153,51,0.22),0_8px_32px_-8px_rgba(255,153,51,0.12)]'
            : 'shadow-[0_0_0_1px_rgba(0,0,0,0.04)]'
        }`}
      >
        <div className="hidden md:block absolute left-1/2 top-32 transform -translate-x-1/2 w-8 h-8 bg-gradient-maharashtra rounded-full border-4 border-white shadow-xl z-10 group-hover:scale-125 transition-transform duration-300">
        </div>

        <div className={`w-full md:w-5/12 space-y-6 ${isEven ? 'md:text-right md:items-end' : 'md:text-left md:items-start'} flex flex-col`}>
          <div>
            <div className="inline-block mb-3">
              <div className="flex items-center gap-2 bg-gradient-maharashtra px-4 py-2 rounded-full shadow-lg">
                <span className="text-white font-bold text-lg">Day {day.day}</span>
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">{day.location}</h3>
            <div className="inline-block px-4 py-1 bg-orange-100 rounded-full mb-4">
              <span className="text-sm font-semibold text-[#FF9933]">{day.activities.length} Experiences</span>
            </div>
          </div>

          <div className="w-full space-y-6">
            {day.flightInfo && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-9 h-9 bg-gradient-maharashtra rounded-xl flex items-center justify-center">
                    <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900">Flight Details</h4>
                </div>
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Departure</span>
                    <span className="font-semibold text-gray-900">{day.flightInfo.from}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Duration</span>
                    <span className="font-semibold text-gray-900">{day.flightInfo.duration}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm text-gray-500">Price</span>
                    <span className="font-bold text-[#FF9933] text-lg">{day.flightInfo.price}</span>
                  </div>
                </div>
              </div>
            )}

            {day.hotels && day.hotels.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-300 mt-4">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Nearby Hotels</h4>
                </div>
                <div className="space-y-5">
                  {day.hotels.map((hotel, idx) => (
                    <div key={idx} className="group/hotel hover:bg-orange-50 rounded-lg p-2.5 -mx-2.5 transition-all duration-200 cursor-pointer mb-2">
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <p className="font-medium text-gray-900 leading-snug">{hotel.name}</p>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full flex-shrink-0">
                          <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-xs font-semibold text-amber-700">{hotel.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-[#FF9933] text-base">{hotel.price}</span>
                        <span className="text-xs text-gray-500">/ night</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-7/12">
          <div className="relative group/card">
            <div className="overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
              <img src={day.image} alt={day.location} className="w-full h-64 object-cover transition-transform duration-700 group-hover/card:scale-110" />
            </div>
            <div className="mt-4 space-y-3">
              {day.activities.map((activity, idx) => (
                <ActivityCard
                  key={idx}
                  activity={activity}
                  isExpanded={expandedActivity === idx}
                  onToggle={() => setExpandedActivity(expandedActivity === idx ? null : idx)}
                  delay={idx * 100}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

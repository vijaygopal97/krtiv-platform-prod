'use client';

import { CloudRain, Sun } from 'lucide-react';

export default function WeatherWidget() {
  return (
    <section className="travel-dash-card p-5 bg-gradient-to-br from-white to-[#F4A261]/10">
      <h2 className="font-display-dash text-base font-semibold text-[#1F2937] mb-3">Weather</h2>
      <p className="text-xs text-[#6B7280]">Current focus · Pune</p>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <Sun className="w-8 h-8 text-[#F4A261]" />
          <div>
            <p className="text-2xl font-semibold text-[#1F2937]">28°C</p>
            <p className="text-xs text-[#6B7280]">Partly cloudy</p>
          </div>
        </div>
        <div className="text-right text-xs text-[#6B7280]">
          <p className="flex items-center justify-end gap-1">
            <CloudRain className="w-3.5 h-3.5" /> 20% rain
          </p>
          <p className="mt-1">Sat · Sun mild</p>
        </div>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-[#6B7280] border-t border-[#E5E7EB] pt-3">
        Travel advice: Evenings are pleasant for ghats walks. Carry a light layer for hill drives.
      </p>
    </section>
  );
}

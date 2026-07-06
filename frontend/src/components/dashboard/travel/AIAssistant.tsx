'use client';

import { Bot } from 'lucide-react';
import Recommendations from './Recommendations';
import type { DashTab } from './DashboardNav';

type Props = {
  onNavigate: (tab: DashTab) => void;
};

export default function AIAssistant({ onNavigate }: Props) {
  return (
    <section className="travel-dash-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-9 h-9 rounded-xl bg-[#1F2937] text-white grid place-items-center">
          <Bot className="w-4 h-4" />
        </span>
        <div>
          <h2 className="font-display-dash text-base font-semibold text-[#1F2937]">AI Assistant</h2>
          <p className="text-xs text-[#6B7280]">Personalized for your next trip</p>
        </div>
      </div>
      <Recommendations onSelect={() => onNavigate('smart')} />
      <button
        type="button"
        onClick={() => onNavigate('smart')}
        className="mt-4 w-full h-10 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-sm font-semibold text-[#1F2937] hover:border-[#C46B2D]/40 transition-colors duration-250"
      >
        Open smart tag planner
      </button>
    </section>
  );
}

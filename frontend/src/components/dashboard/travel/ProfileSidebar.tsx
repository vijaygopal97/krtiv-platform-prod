'use client';

import { motion } from 'framer-motion';
import { Award, MapPin, Route } from 'lucide-react';
import type { User } from '@/services/authService';
import { explorerLevel } from './dashboardUtils';

type Props = {
  user: User;
  tripsCompleted: number;
  placesSaved: number;
  progressPct: number;
};

const BADGES = ['First Trip', 'Coastal Explorer', 'Heritage Buff'];

export default function ProfileSidebar({ user, tripsCompleted, placesSaved, progressPct }: Props) {
  const level = explorerLevel(tripsCompleted);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="travel-dash-card p-5 md:p-6"
    >
      <div className="flex items-center gap-3">
        {user.profilePicture ? (
          <img src={user.profilePicture} alt="" className="w-14 h-14 rounded-2xl object-cover" />
        ) : (
          <span className="w-14 h-14 rounded-2xl bg-[#C46B2D]/15 text-[#C46B2D] text-xl font-bold grid place-items-center">
            {user.name?.charAt(0) || 'U'}
          </span>
        )}
        <div>
          <h2 className="font-semibold text-[#1F2937]">{user.name}</h2>
          <p className="text-xs text-[#C46B2D] font-medium">{level}</p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 mt-5 text-sm">
        <div className="p-3 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB]">
          <dt className="text-[11px] text-[#6B7280]">Trips completed</dt>
          <dd className="font-semibold text-lg text-[#1F2937]">{tripsCompleted}</dd>
        </div>
        <div className="p-3 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB]">
          <dt className="text-[11px] text-[#6B7280]">Saved places</dt>
          <dd className="font-semibold text-lg text-[#1F2937]">{placesSaved}</dd>
        </div>
      </dl>

      <div className="mt-4">
        <p className="text-xs font-medium text-[#6B7280] mb-2 flex items-center gap-1">
          <Award className="w-3.5 h-3.5" /> Achievements
        </p>
        <div className="flex flex-wrap gap-2">
          {BADGES.map((b) => (
            <span key={b} className="text-[10px] px-2 py-1 rounded-full border border-[#E5E7EB] bg-white text-[#6B7280]">
              {b}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex justify-between text-xs text-[#6B7280] mb-1">
          <span className="flex items-center gap-1">
            <Route className="w-3.5 h-3.5" /> Travel progress
          </span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-[#F3F4F6] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-gradient-to-r from-[#C46B2D] to-[#F4A261]"
          />
        </div>
        <div className="mt-3 flex items-end gap-1 h-12">
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-md bg-[#C46B2D]/20" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-[#6B7280] flex items-center gap-1">
        <MapPin className="w-3.5 h-3.5" /> Exploring Maharashtra, one journey at a time
      </p>
    </motion.aside>
  );
}

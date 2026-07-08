'use client';

import { motion } from 'framer-motion';
import { Award, MapPin } from 'lucide-react';
import type { User } from '@/services/authService';
import { explorerLevel } from './dashboardUtils';

type Props = {
  user: User;
  placesSaved: number;
};

const BADGES = ['First Trip', 'Coastal Explorer', 'Heritage Buff'];

export default function ProfileSidebar({ user, placesSaved }: Props) {
  const level = explorerLevel(placesSaved);

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

      <dl className="mt-5 text-sm">
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

      <p className="mt-4 text-xs text-[#6B7280] flex items-center gap-1">
        <MapPin className="w-3.5 h-3.5" /> Exploring Maharashtra, one journey at a time
      </p>
    </motion.aside>
  );
}

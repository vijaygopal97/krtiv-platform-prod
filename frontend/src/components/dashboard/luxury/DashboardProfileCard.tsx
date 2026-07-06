'use client';

import type { User } from '@/services/authService';
import { Award } from 'lucide-react';

type Props = {
  user: User;
  tripsCompleted: number;
};

export function DashboardProfileCard({ user, tripsCompleted }: Props) {
  const level = tripsCompleted >= 5 ? 'Gold Explorer' : tripsCompleted >= 2 ? 'Silver Explorer' : 'Bronze Explorer';
  const progress = Math.min(100, tripsCompleted * 20);

  return (
    <aside className="lux-card lux-gradient-border-top p-6 md:p-8">
      <div className="flex items-center gap-4">
        {user.profilePicture ? (
          <img src={user.profilePicture} alt="" className="w-16 h-16 rounded-2xl object-cover" />
        ) : (
          <span className="w-16 h-16 rounded-2xl bg-[color:var(--lux-primary)]/15 text-[color:var(--lux-primary)] inline-flex items-center justify-center font-display-lux text-2xl">
            {user.name.charAt(0)}
          </span>
        )}
        <div>
          <p className="font-display-lux text-xl">{user.name}</p>
          <p className="text-sm text-[color:var(--lux-muted)] flex items-center gap-1 mt-1">
            <Award className="w-4 h-4" /> {level}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex justify-between text-xs text-[color:var(--lux-muted)] mb-2">
          <span>Travel progress</span>
          <span>{tripsCompleted} trips completed</span>
        </div>
        <div className="h-2 rounded-full bg-[color:var(--lux-border)] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[color:var(--lux-primary-light)] to-[color:var(--lux-primary)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {['Weekend Warrior', 'Heritage Lover', 'Foodie'].map((badge) => (
          <span
            key={badge}
            className="text-xs px-3 py-1 rounded-full border border-[color:var(--lux-border)] text-[color:var(--lux-muted)]"
          >
            {badge}
          </span>
        ))}
      </div>
    </aside>
  );
}

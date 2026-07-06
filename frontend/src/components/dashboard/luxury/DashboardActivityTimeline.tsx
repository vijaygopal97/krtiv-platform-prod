'use client';

import type { SavedItineraryRecord } from '@/lib/myItinerariesApi';

type Props = {
  items: SavedItineraryRecord[];
};

function formatWhen(iso?: string) {
  if (!iso) return 'Recently';
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString();
}

export function DashboardActivityTimeline({ items }: Props) {
  const events = items.slice(0, 6).flatMap((item) => [
    { when: formatWhen(item.updatedAt || item.createdAt), label: `Saved “${item.title}”` },
  ]);

  const defaults = [
    { when: 'Yesterday', label: 'Generated Konkan trip draft' },
    { when: 'This week', label: 'Viewed Ajanta journey guide' },
    { when: 'This week', label: 'Explored Tadoba destination' },
  ];

  const rows = events.length ? events : defaults;

  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-12 md:mt-16 mb-8">
      <h2 className="font-display-lux text-2xl md:text-3xl mb-6">Recent activity</h2>
      <ul className="lux-timeline-line pl-4 space-y-6 max-w-xl">
        {rows.map((row, i) => (
          <li key={i} className="relative pl-6">
            <span className="lux-timeline-dot absolute left-0 top-1.5" />
            <p className="text-xs uppercase tracking-wider text-[color:var(--lux-muted)]">{row.when}</p>
            <p className="text-sm mt-1 text-[color:var(--lux-text)]">{row.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

'use client';

import type { SavedItineraryRecord } from '@/lib/myItinerariesApi';
import { tripDateRange, tripProgress, tripStatus } from './dashboardUtils';

type Props = {
  items: SavedItineraryRecord[];
  loading?: boolean;
  onView: (id: string) => void;
};

export default function UpcomingTrips({ items, loading, onView }: Props) {
  const upcoming = items.slice(0, 5);

  return (
    <section className="travel-dash-card p-5 md:p-6">
      <h2 className="font-display-dash text-lg font-semibold text-[#1F2937] mb-4">Upcoming Trips</h2>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 travel-dash-skeleton" />
          ))}
        </div>
      ) : !upcoming.length ? (
        <p className="text-sm text-[#6B7280] py-4">No upcoming trips yet. Create one to see it here.</p>
      ) : (
        <div className="overflow-x-auto -mx-1">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="text-left text-[#6B7280] text-xs border-b border-[#E5E7EB]">
                <th className="pb-3 font-medium">Destination</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Duration</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">View</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((item) => {
                const progress = tripProgress(item);
                const status = tripStatus(progress);
                const days = item.parsedSummary?.dayCount ?? 3;
                return (
                  <tr key={item._id} className="border-b border-[#F3F4F6] last:border-0">
                    <td className="py-3 pr-2 font-medium text-[#1F2937]">{item.parsedSummary?.region || item.title}</td>
                    <td className="py-3 text-[#6B7280]">{tripDateRange(item)}</td>
                    <td className="py-3 text-[#6B7280]">{days} days</td>
                    <td className="py-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-[#F8F9FB] border border-[#E5E7EB]">{status.label}</span>
                    </td>
                    <td className="py-3 text-right">
                      <button type="button" onClick={() => onView(item._id)} className="text-[#C46B2D] font-semibold text-xs hover:underline">
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

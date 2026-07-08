'use client';

import { useCallback, useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { fetchDashboardOverview, type DashboardOverview } from '@/lib/adminDashboardApi';
import { AdminOverviewContent } from '@/components/admin/AdminOverviewContent';

export default function DashboardAdminStatsTab() {
  const [range, setRange] = useState('30d');
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const user = authService.getCurrentUser();
    if (!user?.token || !authService.isAdmin()) {
      setError('Admin access required.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const overview = await fetchDashboardOverview(user.token, range);
      setData(overview);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !data) {
    return (
      <div className="flex-1 p-8 max-w-6xl mx-auto w-full">
        <p className="text-[color:var(--ink-soft)]">Loading platform stats…</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex-1 p-8 max-w-6xl mx-auto w-full">
        <p className="text-red-700">{error}</p>
        <button type="button" onClick={() => void load()} className="mt-4 text-sm underline">
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 max-w-6xl mx-auto w-full">
      <div className="mb-6">
        <p className="eyebrow text-[color:var(--saffron)]">Admin</p>
        <h2 className="font-display text-2xl mt-1">Platform stats & analytics</h2>
        <p className="text-sm text-[color:var(--ink-soft)] mt-2">
          Video performance, website traffic, hero banners, and user activity.
        </p>
      </div>
      <AdminOverviewContent
        data={data}
        range={range}
        onRangeChange={setRange}
        showPlanner
        compactHeader
      />
    </div>
  );
}

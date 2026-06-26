'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { AdminShell } from '@/components/admin/AdminShell';
import { AdminOverviewContent } from '@/components/admin/AdminOverviewContent';
import { fetchDashboardOverview, type DashboardOverview } from '@/lib/adminDashboardApi';

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [range, setRange] = useState('30d');
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const user = authService.getCurrentUser();
    if (!user?.token || user.role !== 'admin') {
      router.replace('/login?next=/admin/analytics');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const overview = await fetchDashboardOverview(user.token, range);
      setData(overview);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [router, range]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !data) {
    return (
      <AdminShell title="Analytics">
        <p className="text-[color:var(--ink-soft)]">Loading analytics…</p>
      </AdminShell>
    );
  }

  if (error && !data) {
    return (
      <AdminShell title="Analytics">
        <p className="text-red-700">{error}</p>
        <button type="button" onClick={() => void load()} className="mt-4 text-sm underline">
          Retry
        </button>
      </AdminShell>
    );
  }

  if (!data) return null;

  return (
    <AdminShell title="Analytics">
      <AdminOverviewContent data={data} range={range} onRangeChange={setRange} showPlanner />
    </AdminShell>
  );
}

import { getApiBase } from '@/lib/basePath';

export type DashboardOverview = {
  generatedAt: string;
  range: string;
  homeCards: { id: string; label: string; value: number; growth: number }[];
  video: {
    available: boolean;
    totalVideos: number;
    totalViews: number;
    totalLikes: number;
    totalDislikes: number;
    totalShares: number;
    totalComments: number;
    avgWatchTimeSec: number;
    mostViewedVideo: { title: string; views: number } | null;
    mostLikedVideo: { title: string; likes: number } | null;
    dailyViews: { date: string; views: number }[];
    topVideos: { title: string; views: number; likes: number; dislikes: number; category?: string }[];
    likesVsDislikes: { likes: number; dislikes: number };
  };
  ga4: {
    configured?: boolean;
    serverConfigured?: boolean;
    status?: string;
    measurementId?: string;
    overview?: {
      totalVisitors: number;
      activeUsers: number;
      newUsers: number;
      returningUsers: number;
      pageViews: number;
      sessionDurationSec: number;
      bounceRate: number;
      realtimeUsers: number;
    };
    topSources?: { label: string; value: number }[];
    topCountries?: { label: string; value: number }[];
    topPages?: { label: string; value: number }[];
    dailyTraffic?: { date: string; users: number; pageViews: number }[];
  };
  hero: {
    totalBanners: number;
    activeBanners: number;
    inactiveBanners: number;
    scheduledBanners: number;
    totalImpressions: number;
    totalClicks: number;
    ctr: number;
    performance: {
      banner: string;
      scope: string;
      impressions: number;
      clicks: number;
      ctr: number;
      status: string;
    }[];
  };
  planner: {
    generationsTotal: number;
    generationsByCategory: { name: string; count: number }[];
    topKeywords: { name: string; count: number }[];
    categoryKeywords: Record<string, { name: string; count: number }[]>;
    googleLoginsTotal: number;
    googleSignupsTotal: number;
    googleReturningLoginsTotal: number;
    lastGoogleLoginAt?: string | null;
    passwordLoginsTotal: number;
    registeredUsersTotal: number;
    updatedAt?: string;
  };
  recentActivity: { type: string; label: string; at: string }[];
};

export async function fetchDashboardOverview(token: string, range: string): Promise<DashboardOverview> {
  const base = getApiBase().replace(/\/$/, '');
  const res = await fetch(`${base}/admin/dashboard-overview?range=${encodeURIComponent(range)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load dashboard');
  return data.overview;
}

import SavedItinerary from '../models/SavedItinerary.js';
import User from '../models/User.js';
import HeroSlide from '../models/HeroSlide.js';
import { getPlannerAdminStats } from './plannerAnalytics.js';
import { fetchGa4Dashboard, isGa4Configured } from './ga4Reports.js';

const SIGNPOST_BASE = (process.env.SIGNPOST_BASE_URL || 'https://eflag.in').replace(/\/$/, '');
const SIGNPOST_API_KEY =
  process.env.SIGNPOST_API_KEY ||
  'c1b28a78c58efa1c3a0966f2063f240ebbdc60d50d76c7d802723e1e325f2387';

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function resolveRange(range = '30d') {
  const now = new Date();
  const end = now;
  const r = String(range).toLowerCase();
  let days = 30;
  if (r === 'today' || r === '1d') days = 1;
  else if (r === '7d') days = 7;
  else if (r === '90d') days = 90;
  const since = startOfDay(new Date(now.getTime() - (days - 1) * 86400000));
  const prevSince = startOfDay(new Date(since.getTime() - days * 86400000));
  return { since, end, days, prevSince, prevEnd: new Date(since.getTime() - 1) };
}

function growthPct(current, previous) {
  if (!previous || previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

async function fetchVideoAnalytics() {
  try {
    const res = await fetch(`${SIGNPOST_BASE}/api/v1/video-analytics`, {
      headers: { 'X-API-Key': SIGNPOST_API_KEY, Accept: 'application/json' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error('video-analytics', e.message || e);
    return null;
  }
}

function countComments(videoPayload) {
  const videos = videoPayload?.videos || [];
  return videos.reduce((sum, v) => sum + (v.feedbackCount || 0), 0);
}

async function getHeroAnalytics() {
  const now = new Date();
  const slides = await HeroSlide.find().select('title active impressions clicks scheduledStart scheduledEnd scope updatedAt').lean();
  const total = slides.length;
  const active = slides.filter((s) => s.active).length;
  const inactive = total - active;
  const scheduled = slides.filter(
    (s) => s.scheduledStart && new Date(s.scheduledStart) > now
  ).length;
  const impressions = slides.reduce((a, s) => a + (s.impressions || 0), 0);
  const clicks = slides.reduce((a, s) => a + (s.clicks || 0), 0);
  const ctr = impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0;

  const performance = slides
    .map((s) => {
      const imp = s.impressions || 0;
      const clk = s.clicks || 0;
      let status = s.active ? 'Active' : 'Inactive';
      if (s.scheduledStart && new Date(s.scheduledStart) > now) status = 'Scheduled';
      return {
        banner: s.title,
        scope: s.scope,
        impressions: imp,
        clicks: clk,
        ctr: imp > 0 ? Math.round((clk / imp) * 10000) / 100 : 0,
        status,
      };
    })
    .sort((a, b) => b.impressions - a.impressions);

  return {
    totalBanners: total,
    activeBanners: active,
    inactiveBanners: inactive,
    scheduledBanners: scheduled,
    totalImpressions: impressions,
    totalClicks: clicks,
    ctr,
    performance,
  };
}

async function getRecentActivity() {
  const [users, heroes, saves] = await Promise.all([
    User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt').lean(),
    HeroSlide.find().sort({ updatedAt: -1 }).limit(5).select('title updatedAt createdAt active').lean(),
    SavedItinerary.find().sort({ createdAt: -1 }).limit(5).select('title createdAt').lean(),
  ]);

  const items = [
    ...users.map((u) => ({
      type: 'user_registration',
      label: `New user: ${u.name || u.email}`,
      at: u.createdAt,
    })),
    ...heroes.map((h) => ({
      type: h.createdAt?.getTime() === h.updatedAt?.getTime() ? 'hero_create' : 'hero_edit',
      label: `Hero banner: ${h.title}`,
      at: h.updatedAt,
    })),
    ...saves.map((s) => ({
      type: 'itinerary_save',
      label: `Itinerary saved: ${s.title}`,
      at: s.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 12);

  return items;
}

export async function getAdminDashboardOverview({ range = '30d' } = {}) {
  const { since, end, days, prevSince, prevEnd } = resolveRange(range);
  const gaStart = days === 1 ? 'today' : `${days}daysAgo`;

  const [planner, hero, videoRaw, ga4, userCount, usersInRange, usersPrev, savesInRange, recentActivity] =
    await Promise.all([
      getPlannerAdminStats(),
      getHeroAnalytics(),
      fetchVideoAnalytics(),
      fetchGa4Dashboard({ startDate: gaStart, endDate: 'today' }),
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: since, $lte: end } }),
      User.countDocuments({ createdAt: { $gte: prevSince, $lte: prevEnd } }),
      SavedItinerary.countDocuments({ createdAt: { $gte: since, $lte: end } }),
      getRecentActivity(),
    ]);

  const video = videoRaw || {
    overview: {},
    dailyViews: [],
    videos: [],
    topByViews: [],
    topByLikes: [],
  };
  const vo = video.overview || {};
  const totalVideos = (video.videos || []).length;
  const totalViews = vo.totalViews || 0;
  const totalLikes = vo.totalLikes || 0;
  const totalDislikes = vo.totalDislikes || 0;
  const totalShares = vo.totalShares || 0;
  const totalComments = countComments(video);
  const avgWatch = vo.avgWatchDurationSec || 0;
  const mostViewed = video.topByViews?.[0] || null;
  const mostLiked = video.topByLikes?.[0] || null;

  const visitors = ga4?.configured && ga4.status === 'ok' ? ga4.overview.totalVisitors : 0;

  const homeCards = [
    {
      id: 'users',
      label: 'Users',
      value: userCount,
      growth: growthPct(usersInRange, usersPrev),
    },
    {
      id: 'videos',
      label: 'Videos',
      value: totalVideos,
      growth: 0,
    },
    {
      id: 'views',
      label: 'Views',
      value: totalViews,
      growth: 0,
    },
    {
      id: 'likes',
      label: 'Likes',
      value: totalLikes,
      growth: 0,
    },
    {
      id: 'shares',
      label: 'Shares',
      value: totalShares,
      growth: 0,
    },
    {
      id: 'heroes',
      label: 'Hero banners',
      value: hero.totalBanners,
      growth: 0,
    },
    {
      id: 'visitors',
      label: 'Website visitors',
      value: visitors,
      growth: 0,
    },
  ];

  return {
    generatedAt: new Date().toISOString(),
    range,
    homeCards,
    video: {
      available: Boolean(videoRaw),
      totalVideos,
      totalViews,
      totalLikes,
      totalDislikes,
      totalShares,
      totalComments,
      avgWatchTimeSec: avgWatch,
      mostViewedVideo: mostViewed
        ? { title: mostViewed.title, views: mostViewed.views }
        : null,
      mostLikedVideo: mostLiked ? { title: mostLiked.title, likes: mostLiked.likes } : null,
      dailyViews: video.dailyViews || [],
      topVideos: (video.topByViews || []).slice(0, 10),
      likesVsDislikes: { likes: totalLikes, dislikes: totalDislikes },
    },
    ga4: {
      ...ga4,
      serverConfigured: isGa4Configured(),
      measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.GA4_MEASUREMENT_ID || 'G-D1XM5S3NFY',
    },
    hero,
    planner,
    recentActivity,
    savesInRange,
  };
}

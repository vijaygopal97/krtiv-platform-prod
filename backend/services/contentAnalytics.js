/**
 * Admin dashboard: saved itineraries, user engagement, SignPost video metrics.
 */
import SavedItinerary from '../models/SavedItinerary.js';
import User from '../models/User.js';
import VideoReaction from '../models/VideoReaction.js';
import { getPlannerAdminStats } from './plannerAnalytics.js';

const SIGNPOST_BASE = (process.env.SIGNPOST_BASE_URL || 'https://eflag.in').replace(/\/$/, '');
const SIGNPOST_API_KEY =
  process.env.SIGNPOST_API_KEY ||
  'c1b28a78c58efa1c3a0966f2063f240ebbdc60d50d76c7d802723e1e325f2387';

/** Dashboard category slugs → SignPost API category names */
export const ANALYTICS_CATEGORIES = [
  { slug: '', label: 'All categories' },
  { slug: 'historical', label: 'Heritage', signpost: 'Historical & Heritage' },
  { slug: 'adventure', label: 'Adventure', signpost: 'Adventure & Ecotourism' },
  { slug: 'spiritual', label: 'Spiritual', signpost: 'Spiritual & Pilgrimage' },
  { slug: 'culinary', label: 'Culinary', signpost: 'Culinary & Rural' },
  { slug: 'art-culture', label: 'Art & Culture', signpost: 'Art, Craft & Culture' },
  { slug: 'urban', label: 'Urban', signpost: 'Urban & Contemporary' },
  { slug: 'weddings', label: 'Weddings', signpost: 'Weddings' },
  { slug: 'explore', label: 'Explore', signpost: '' },
];

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export function resolveDateRange({ range = '30d', since, until } = {}) {
  const now = new Date();
  const end = until ? endOfDay(new Date(until)) : endOfDay(now);
  let start;
  if (since) {
    start = startOfDay(new Date(since));
  } else {
    const r = String(range).toLowerCase();
    if (r === 'today' || r === '1d') {
      start = startOfDay(now);
    } else if (r === '7d') {
      start = startOfDay(new Date(now.getTime() - 6 * 86400000));
    } else if (r === '90d') {
      start = startOfDay(new Date(now.getTime() - 89 * 86400000));
    } else {
      start = startOfDay(new Date(now.getTime() - 29 * 86400000));
    }
  }
  if (Number.isNaN(start.getTime())) start = startOfDay(new Date(now.getTime() - 29 * 86400000));
  if (Number.isNaN(end.getTime())) return { since: start, until: endOfDay(now), range };
  return { since: start, until: end, range };
}

function signpostCategoryForSlug(slug) {
  if (!slug || slug === 'explore') return '';
  const row = ANALYTICS_CATEGORIES.find((c) => c.slug === slug);
  return row?.signpost || '';
}

async function fetchSignPostVideoAnalytics({ since, until, categorySlug }) {
  const category = signpostCategoryForSlug(categorySlug);
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (since) params.set('since', since.toISOString());
  if (until) params.set('until', until.toISOString());
  const url = `${SIGNPOST_BASE}/api/v1/video-analytics?${params}`;
  try {
    const res = await fetch(url, {
      headers: { 'X-API-Key': SIGNPOST_API_KEY, Accept: 'application/json' },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('SignPost video-analytics', res.status, text.slice(0, 200));
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error('SignPost video-analytics fetch error', err.message || err);
    return null;
  }
}

function slugLabel(slug) {
  const row = ANALYTICS_CATEGORIES.find((c) => c.slug === slug);
  return row?.label || slug || 'General';
}

async function getSavedItineraryAnalytics({ since, until, categorySlug }) {
  const todayStart = startOfDay(new Date());
  const weekStart = startOfDay(new Date(Date.now() - 6 * 86400000));
  const monthStart = startOfDay(new Date(Date.now() - 29 * 86400000));

  const baseMatch = {};
  if (categorySlug && categorySlug !== 'explore') {
    baseMatch.categorySlug = categorySlug;
  } else if (categorySlug === 'explore') {
    baseMatch.$or = [{ categorySlug: '' }, { categorySlug: { $exists: false } }];
  }

  const countIn = (from, to, extra = {}) =>
    SavedItinerary.countDocuments({
      ...baseMatch,
      ...extra,
      createdAt: { $gte: from, $lte: to },
    });

  const [total, savedToday, savedWeek, savedMonth, savedInRange] = await Promise.all([
    SavedItinerary.countDocuments(baseMatch),
    countIn(todayStart, endOfDay(new Date())),
    countIn(weekStart, endOfDay(new Date())),
    countIn(monthStart, endOfDay(new Date())),
    countIn(since, until),
  ]);

  const topByTitle = await SavedItinerary.aggregate([
    { $match: baseMatch },
    {
      $group: {
        _id: '$title',
        saveCount: { $sum: 1 },
        users: { $addToSet: '$userId' },
        categorySlug: { $first: '$categorySlug' },
      },
    },
    {
      $project: {
        title: '$_id',
        saveCount: 1,
        uniqueUsers: { $size: '$users' },
        categorySlug: 1,
        avgEngagement: {
          $cond: [{ $gt: ['$saveCount', 0] }, { $divide: ['$saveCount', { $size: '$users' }] }, 0],
        },
      },
    },
    { $sort: { saveCount: -1 } },
    { $limit: 10 },
  ]);

  const byCategory = await SavedItinerary.aggregate([
    { $match: baseMatch },
    {
      $group: {
        _id: '$categorySlug',
        saveCount: { $sum: 1 },
        users: { $addToSet: '$userId' },
      },
    },
    {
      $project: {
        categorySlug: '$_id',
        saveCount: 1,
        uniqueUsers: { $size: '$users' },
        avgEngagement: {
          $cond: [{ $gt: ['$saveCount', 0] }, { $divide: ['$saveCount', { $size: '$users' }] }, 0],
        },
      },
    },
    { $sort: { saveCount: -1 } },
  ]);

  const categoryBreakdown = byCategory.map((row) => ({
    categorySlug: row.categorySlug || 'explore',
    label: slugLabel(row.categorySlug || 'explore'),
    saveCount: row.saveCount,
    uniqueUsers: row.uniqueUsers,
    avgEngagement: Math.round((row.avgEngagement || 0) * 100) / 100,
  }));

  const dailyGrowth = await SavedItinerary.aggregate([
    { $match: { ...baseMatch, createdAt: { $gte: since, $lte: until } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { date: '$_id', count: 1, _id: 0 } },
  ]);

  const recent = await SavedItinerary.find(baseMatch)
    .sort({ createdAt: -1 })
    .limit(12)
    .select('title categorySlug categoryFocus userId createdAt')
    .populate('userId', 'name email')
    .lean();

  return {
    total,
    savedToday,
    savedThisWeek: savedWeek,
    savedThisMonth: savedMonth,
    savedInRange,
    topSaved: topByTitle.map((t) => ({
      title: t.title,
      saveCount: t.saveCount,
      uniqueUsers: t.uniqueUsers,
      avgEngagement: Math.round((t.avgEngagement || 0) * 100) / 100,
      categoryLabel: slugLabel(t.categorySlug),
    })),
    categoryBreakdown,
    dailyGrowth,
    recentlySaved: recent.map((r) => ({
      title: r.title,
      categoryLabel: slugLabel(r.categorySlug),
      savedAt: r.createdAt,
      userName: r.userId?.name || 'User',
    })),
  };
}

async function getUserEngagementAnalytics({ since, until }) {
  const [totalUsers, activeUsers, savedUserIds, reactionUserIds] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ lastLoginAt: { $gte: since, $lte: until } }),
    SavedItinerary.distinct('userId', { createdAt: { $gte: since, $lte: until } }),
    VideoReaction.distinct('userId'),
  ]);

  const returningUsers = await User.countDocuments({
    lastLoginAt: { $gte: since, $lte: until },
    createdAt: { $lt: since },
  });

  const mostActive = await SavedItinerary.aggregate([
    { $match: { createdAt: { $gte: since, $lte: until } } },
    { $group: { _id: '$userId', saves: { $sum: 1 } } },
    { $sort: { saves: -1 } },
    { $limit: 8 },
  ]);
  const userIds = mostActive.map((m) => m._id);
  const users = await User.find({ _id: { $in: userIds } }).select('name email').lean();
  const userMap = new Map(users.map((u) => [String(u._id), u]));

  return {
    totalUsers,
    activeUsers,
    returningUsers,
    savedItineraryUsers: savedUserIds.length,
    videoViewers: reactionUserIds.length,
    mostActiveUsers: mostActive.map((m) => ({
      name: userMap.get(String(m._id))?.name || 'User',
      email: userMap.get(String(m._id))?.email || '',
      saves: m.saves,
    })),
  };
}

export async function getDashboardAnalytics(query = {}) {
  const { since, until, range } = resolveDateRange(query);
  const categorySlug = (query.category && String(query.category).trim()) || '';

  const [planner, savedItineraries, users, videoRaw] = await Promise.all([
    getPlannerAdminStats(),
    getSavedItineraryAnalytics({ since, until, categorySlug }),
    getUserEngagementAnalytics({ since, until }),
    fetchSignPostVideoAnalytics({ since, until, categorySlug }),
  ]);

  const video = videoRaw || {
    overview: {
      totalViews: 0,
      totalLikes: 0,
      totalDislikes: 0,
      totalShares: 0,
      totalWatchSeconds: 0,
      avgWatchDurationSec: 0,
      avgCompletionRate: null,
      avgEditorialRating: null,
      totalRatings: 0,
      uniqueViews: 0,
      repeatViews: 0,
    },
    ratingDistribution: {
      stars1: 0,
      stars2: 0,
      stars3: 0,
      stars4: 0,
      stars5: 0,
      total: 0,
      average: null,
    },
    dailyViews: [],
    videos: [],
    topByViews: [],
    topByLikes: [],
    topByRating: [],
    mostEngaging: [],
    leastEngaging: [],
    unavailable: true,
  };

  return {
    generatedAt: new Date().toISOString(),
    filters: { range, since: since.toISOString(), until: until.toISOString(), category: categorySlug },
    planner,
    savedItineraries,
    users,
    video,
  };
}

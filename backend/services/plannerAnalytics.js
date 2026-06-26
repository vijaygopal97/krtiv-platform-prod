import ItineraryPlannerStat, { PLANNER_STAT_KEY } from '../models/ItineraryPlannerStat.js';
import User from '../models/User.js';

async function getDoc() {
  let doc = await ItineraryPlannerStat.findOne({ key: PLANNER_STAT_KEY });
  if (!doc) {
    doc = await ItineraryPlannerStat.create({ key: PLANNER_STAT_KEY });
  }
  return doc;
}

function bumpMapField(doc, mapPath, key, delta = 1) {
  const current = doc.get(mapPath)?.get(key) || 0;
  doc.set(`${mapPath}.${key}`, current + delta);
}

export async function recordKeywordGeneration({ keywords = [], categoryFocus = '', categorySlug = '' }) {
  const doc = await getDoc();
  doc.generationsTotal = (doc.generationsTotal || 0) + 1;
  if (categoryFocus) {
    bumpMapField(doc, 'generationsByCategory', categoryFocus);
  }
  for (const kw of keywords) {
    const k = String(kw).trim();
    if (!k) continue;
    bumpMapField(doc, 'keywordCounts', k);
    if (categoryFocus) {
      const catKey = categoryFocus;
      const prev = doc.categoryKeywordCounts?.get(catKey);
      const nested = prev && typeof prev === 'object' ? { ...prev } : {};
      nested[k] = (nested[k] || 0) + 1;
      if (!doc.categoryKeywordCounts) doc.categoryKeywordCounts = new Map();
      doc.categoryKeywordCounts.set(catKey, nested);
      doc.markModified('categoryKeywordCounts');
    }
  }
  await doc.save();
}

export async function recordGoogleAuth({ isNewUser = false } = {}) {
  const doc = await getDoc();
  doc.googleLoginsTotal = (doc.googleLoginsTotal || 0) + 1;
  if (isNewUser) {
    doc.googleSignupsTotal = (doc.googleSignupsTotal || 0) + 1;
  } else {
    doc.googleReturningLoginsTotal = (doc.googleReturningLoginsTotal || 0) + 1;
  }
  doc.lastGoogleLoginAt = new Date();
  await doc.save();
}

/** @deprecated use recordGoogleAuth */
export async function recordGoogleLogin() {
  return recordGoogleAuth({ isNewUser: false });
}

export async function recordPasswordLogin() {
  const doc = await getDoc();
  doc.passwordLoginsTotal = (doc.passwordLoginsTotal || 0) + 1;
  await doc.save();
}

export async function syncRegisteredUserCount() {
  const count = await User.countDocuments();
  const doc = await getDoc();
  doc.registeredUsersTotal = count;
  await doc.save();
}

export async function getPlannerAdminStats() {
  const doc = await getDoc();
  const toSorted = (map) =>
    [...(map?.entries?.() || [])]
      .map(([name, count]) => ({ name, count: Number(count) || 0 }))
      .sort((a, b) => b.count - a.count);

  const categoryKeywords = {};
  if (doc.categoryKeywordCounts) {
    for (const [cat, obj] of doc.categoryKeywordCounts.entries()) {
      categoryKeywords[cat] = Object.entries(obj || {})
        .map(([name, count]) => ({ name, count: Number(count) || 0 }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);
    }
  }

  return {
    generationsTotal: doc.generationsTotal || 0,
    generationsByCategory: toSorted(doc.generationsByCategory).slice(0, 20),
    topKeywords: toSorted(doc.keywordCounts).slice(0, 30),
    categoryKeywords,
    googleLoginsTotal: doc.googleLoginsTotal || 0,
    googleSignupsTotal: doc.googleSignupsTotal || 0,
    googleReturningLoginsTotal: doc.googleReturningLoginsTotal || 0,
    lastGoogleLoginAt: doc.lastGoogleLoginAt || null,
    passwordLoginsTotal: doc.passwordLoginsTotal || 0,
    registeredUsersTotal: doc.registeredUsersTotal || 0,
    updatedAt: doc.updatedAt,
  };
}

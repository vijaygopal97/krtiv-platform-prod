import { GoogleAuth } from 'google-auth-library';

const PROPERTY_ID = process.env.GA4_PROPERTY_ID?.trim();
const CLIENT_EMAIL = process.env.GA4_CLIENT_EMAIL?.trim();
const PRIVATE_KEY = process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, '\n');

export function isGa4Configured() {
  return Boolean(PROPERTY_ID && CLIENT_EMAIL && PRIVATE_KEY);
}

async function runReport(body) {
  if (!isGa4Configured()) return null;
  const auth = new GoogleAuth({
    credentials: { client_email: CLIENT_EMAIL, private_key: PRIVATE_KEY },
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  if (!token) return null;
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('GA4 runReport', res.status, text.slice(0, 300));
    return null;
  }
  return res.json();
}

function metricValue(report, index = 0) {
  const row = report?.rows?.[0];
  if (!row?.metricValues?.[index]) return 0;
  return Number(row.metricValues[index].value) || 0;
}

function dimensionRows(report, metricIndex = 0, limit = 10) {
  const rows = report?.rows || [];
  return rows.slice(0, limit).map((row) => ({
    label: row.dimensionValues?.[0]?.value || '(not set)',
    value: Number(row.metricValues?.[metricIndex]?.value) || 0,
  }));
}

export async function fetchGa4Dashboard({ startDate = '30daysAgo', endDate = 'today' } = {}) {
  if (!isGa4Configured()) {
    return { configured: false, status: 'not_configured' };
  }

  const dateRanges = [{ startDate, endDate }];

  const [summary, sources, countries, pages, realtime] = await Promise.all([
    runReport({
      dateRanges,
      metrics: [
        { name: 'activeUsers' },
        { name: 'newUsers' },
        { name: 'totalUsers' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
        { name: 'sessions' },
      ],
    }),
    runReport({
      dateRanges,
      dimensions: [{ name: 'sessionSource' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 8,
    }),
    runReport({
      dateRanges,
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }],
      orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      limit: 8,
    }),
    runReport({
      dateRanges,
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10,
    }),
    runReport({
      dateRanges: [{ startDate: 'today', endDate: 'today' }],
      metrics: [{ name: 'activeUsers' }],
    }).catch(() => null),
  ]);

  if (!summary) {
    return { configured: true, status: 'error', message: 'Could not load Google Analytics data.' };
  }

  const daily = await runReport({
    dateRanges,
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
    orderBys: [{ dimension: { dimensionName: 'date' } }],
  });

  const dailyPoints = (daily?.rows || []).map((row) => ({
    date: row.dimensionValues?.[0]?.value || '',
    users: Number(row.metricValues?.[0]?.value) || 0,
    pageViews: Number(row.metricValues?.[1]?.value) || 0,
  }));

  const totalUsers = metricValue(summary, 2);
  const newUsers = metricValue(summary, 1);
  const returningUsers = Math.max(0, totalUsers - newUsers);

  return {
    configured: true,
    status: 'ok',
    overview: {
      totalVisitors: totalUsers,
      activeUsers: metricValue(summary, 0),
      newUsers,
      returningUsers,
      pageViews: metricValue(summary, 3),
      sessionDurationSec: metricValue(summary, 4),
      bounceRate: metricValue(summary, 5) * 100,
      sessions: metricValue(summary, 6),
      realtimeUsers: metricValue(realtime, 0),
    },
    topSources: dimensionRows(sources),
    topCountries: dimensionRows(countries),
    topPages: dimensionRows(pages),
    dailyTraffic: dailyPoints,
  };
}

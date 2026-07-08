'use client';

import Link from 'next/link';
import { DualBarChart, LineTrendChart, Section, StatCard } from '@/components/admin/AnalyticsCharts';
import type { DashboardOverview } from '@/lib/adminDashboardApi';

export const ANALYTICS_RANGES = [
  { id: 'today', label: 'Today' },
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
  { id: '90d', label: '90 days' },
] as const;

export function formatAnalyticsDuration(sec: number) {
  if (!sec) return '0s';
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return m ? `${m}m ${s}s` : `${s}s`;
}

export function PlannerStatsLegacy({ stats }: { stats: DashboardOverview['planner'] }) {
  return (
    <>
      <Section title="Google authentication">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Google sign-ins', value: stats.googleLoginsTotal },
            { label: 'New users via Google', value: stats.googleSignupsTotal ?? 0 },
            { label: 'Returning Google users', value: stats.googleReturningLoginsTotal ?? 0 },
            {
              label: 'Last Google login',
              value: stats.lastGoogleLoginAt
                ? new Date(stats.lastGoogleLoginAt).toLocaleString()
                : '—',
            },
          ].map((c) => (
            <div key={c.label} className="rounded-xl bg-white border hairline p-4">
              <p className="text-xs text-[color:var(--ink-soft)]">{c.label}</p>
              <p className="text-lg font-semibold mt-1 break-words">{c.value}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Itinerary generations', value: stats.generationsTotal },
          { label: 'Registered users', value: stats.registeredUsersTotal },
          { label: 'Google logins (all)', value: stats.googleLoginsTotal },
          { label: 'Password logins', value: stats.passwordLoginsTotal },
        ].map((c) => (
          <StatCard key={c.label} label={c.label} value={c.value} />
        ))}
      </div>

      <Section title="Top keywords">
        <div className="rounded-2xl bg-white border hairline p-6">
          <ul className="space-y-2 text-sm">
            {stats.topKeywords.map((k) => (
              <li key={k.name} className="flex justify-between gap-4">
                <span>{k.name}</span>
                <span className="text-[color:var(--ink-soft)]">{k.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="Generations by category">
        <div className="rounded-2xl bg-white border hairline p-6">
          <ul className="space-y-2 text-sm">
            {stats.generationsByCategory.map((k) => (
              <li key={k.name} className="flex justify-between gap-4">
                <span>{k.name}</span>
                <span className="text-[color:var(--ink-soft)]">{k.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {Object.entries(stats.categoryKeywords || {}).map(([cat, kws]) => (
        <Section key={cat} title={`${cat} — top tags`}>
          <div className="rounded-2xl bg-white border hairline p-6">
            <ul className="space-y-2 text-sm">
              {kws.map((k) => (
                <li key={k.name} className="flex justify-between gap-4">
                  <span>{k.name}</span>
                  <span className="text-[color:var(--ink-soft)]">{k.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ))}
    </>
  );
}

type Props = {
  data: DashboardOverview;
  range: string;
  onRangeChange: (range: string) => void;
  showPlanner?: boolean;
  compactHeader?: boolean;
};

export function AdminOverviewContent({
  data,
  range,
  onRangeChange,
  showPlanner = true,
  compactHeader = false,
}: Props) {
  const ga = data.ga4;
  const gaOk = ga?.configured && ga?.status === 'ok';

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-[color:var(--ink-soft)]">
            Updated {new Date(data.generatedAt).toLocaleString()}
          </p>
          {compactHeader ? (
            <p className="text-xs text-[color:var(--ink-soft)] mt-1">
              <Link href="/admin/analytics" className="underline">
                Open full admin analytics
              </Link>
              {' · '}
              <Link href="/admin/hero" className="underline">
                Hero CMS
              </Link>
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {ANALYTICS_RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onRangeChange(r.id)}
              className={`px-3 py-1.5 rounded-full text-xs border ${
                range === r.id
                  ? 'bg-[color:var(--ink)] text-white border-transparent'
                  : 'bg-white hairline'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <Section id="overview" title="Dashboard overview">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {data.homeCards.map((c) => (
            <StatCard key={c.id} label={c.label} value={c.value} growth={c.growth} />
          ))}
        </div>
      </Section>

      <Section id="video" title="Video analytics">
        {!data.video.available ? (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            Video metrics are loading from SignPost. If empty, ensure the video-analytics API is deployed on
            SignPost.
          </p>
        ) : null}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total videos" value={data.video.totalVideos} />
          <StatCard label="Total views" value={data.video.totalViews} />
          <StatCard label="Total likes" value={data.video.totalLikes} />
          <StatCard label="Total dislikes" value={data.video.totalDislikes} />
          <StatCard label="Total shares" value={data.video.totalShares} hint="Not tracked on platform yet" />
          <StatCard label="Total comments" value={data.video.totalComments} hint="Visitor feedback entries" />
          <StatCard label="Avg watch time" value={formatAnalyticsDuration(data.video.avgWatchTimeSec)} />
          <StatCard
            label="Most viewed"
            value={data.video.mostViewedVideo?.title?.slice(0, 28) || '—'}
            hint={data.video.mostViewedVideo ? `${data.video.mostViewedVideo.views} views` : undefined}
          />
          <StatCard
            label="Most liked"
            value={data.video.mostLikedVideo?.title?.slice(0, 28) || '—'}
            hint={data.video.mostLikedVideo ? `${data.video.mostLikedVideo.likes} likes` : undefined}
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          <LineTrendChart
            title="Views growth"
            points={data.video.dailyViews.map((d) => ({
              label: d.date.slice(5),
              value: d.views,
            }))}
          />
          <DualBarChart
            title="Likes vs dislikes"
            aLabel="Likes"
            aValue={data.video.likesVsDislikes.likes}
            bLabel="Dislikes"
            bValue={data.video.likesVsDislikes.dislikes}
          />
        </div>
        <div className="rounded-2xl bg-white border hairline p-4 overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="text-left text-xs text-[color:var(--ink-soft)] border-b hairline">
                <th className="py-2 pr-4">Video</th>
                <th className="py-2 pr-4">Views</th>
                <th className="py-2 pr-4">Likes</th>
                <th className="py-2">Dislikes</th>
              </tr>
            </thead>
            <tbody>
              {data.video.topVideos.map((v) => (
                <tr key={v.title + String(v.views)} className="border-b hairline/50">
                  <td className="py-2 pr-4 max-w-[200px] truncate">{v.title}</td>
                  <td className="py-2 pr-4 tabular-nums">{v.views}</td>
                  <td className="py-2 pr-4 tabular-nums">{v.likes}</td>
                  <td className="py-2 tabular-nums">{v.dislikes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {ga?.serverConfigured ? (
      <Section id="ga4" title="Google Analytics (GA4)">
        {!gaOk ? (
          <p className="text-sm text-red-700">Connected but could not load reports. Check service account access.</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-4 mb-4 items-center">
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Connected · Realtime: {ga.overview?.realtimeUsers ?? 0} users
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <StatCard label="Total visitors" value={ga.overview?.totalVisitors ?? 0} />
              <StatCard label="Active users" value={ga.overview?.activeUsers ?? 0} />
              <StatCard label="New users" value={ga.overview?.newUsers ?? 0} />
              <StatCard label="Returning users" value={ga.overview?.returningUsers ?? 0} />
              <StatCard label="Page views" value={ga.overview?.pageViews ?? 0} />
              <StatCard
                label="Session duration"
                value={formatAnalyticsDuration(ga.overview?.sessionDurationSec ?? 0)}
              />
              <StatCard label="Bounce rate" value={`${(ga.overview?.bounceRate ?? 0).toFixed(1)}%`} />
            </div>
            <LineTrendChart
              title="Traffic trend"
              points={(ga.dailyTraffic || []).map((d) => ({
                label: `${d.date.slice(4, 6)}/${d.date.slice(6, 8)}`,
                value: d.users,
              }))}
            />
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              {[
                { title: 'Top sources', rows: ga.topSources },
                { title: 'Top countries', rows: ga.topCountries },
                { title: 'Top pages', rows: ga.topPages },
              ].map((block) => (
                <div key={block.title} className="rounded-2xl bg-white border hairline p-4">
                  <h4 className="text-sm font-semibold mb-2">{block.title}</h4>
                  <ul className="text-xs space-y-1">
                    {(block.rows || []).map((r) => (
                      <li key={r.label} className="flex justify-between gap-2">
                        <span className="truncate">{r.label}</span>
                        <span className="text-[color:var(--ink-soft)]">{r.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </Section>
      ) : null}

      <Section id="hero-stats" title="Hero CMS analytics">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <StatCard label="Total banners" value={data.hero.totalBanners} />
          <StatCard label="Active" value={data.hero.activeBanners} />
          <StatCard label="Inactive" value={data.hero.inactiveBanners} />
          <StatCard label="Scheduled" value={data.hero.scheduledBanners} />
          <StatCard label="Impressions" value={data.hero.totalImpressions} />
          <StatCard label="Clicks" value={data.hero.totalClicks} />
          <StatCard label="CTR" value={`${data.hero.ctr}%`} />
        </div>
        <Link href="/admin/hero" className="text-sm underline mb-4 inline-block">
          Manage hero banners →
        </Link>
        <div className="rounded-2xl bg-white border hairline overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-xs text-[color:var(--ink-soft)] border-b hairline">
                <th className="p-3">Banner</th>
                <th className="p-3">Impressions</th>
                <th className="p-3">Clicks</th>
                <th className="p-3">CTR</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.hero.performance.map((row) => (
                <tr key={row.banner + row.scope} className="border-b hairline/50">
                  <td className="p-3">{row.banner}</td>
                  <td className="p-3 tabular-nums">{row.impressions}</td>
                  <td className="p-3 tabular-nums">{row.clicks}</td>
                  <td className="p-3 tabular-nums">{row.ctr}%</td>
                  <td className="p-3">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="activity" title="Recent activity">
        <ul className="rounded-2xl bg-white border hairline divide-y hairline">
          {data.recentActivity.length === 0 ? (
            <li className="p-4 text-sm text-[color:var(--ink-soft)]">No recent activity.</li>
          ) : (
            data.recentActivity.map((item, i) => (
              <li key={`${item.type}-${i}`} className="p-4 flex justify-between gap-4 text-sm">
                <span>{item.label}</span>
                <time className="text-xs text-[color:var(--ink-soft)] shrink-0">
                  {new Date(item.at).toLocaleString()}
                </time>
              </li>
            ))
          )}
        </ul>
      </Section>

      {showPlanner ? (
        <div className="border-t hairline pt-10 mt-10">
          <p className="eyebrow mb-2">Planner & login</p>
          <h2 className="font-display text-2xl mb-6">Planner & login analytics</h2>
          <PlannerStatsLegacy stats={data.planner} />
        </div>
      ) : null}
    </>
  );
}

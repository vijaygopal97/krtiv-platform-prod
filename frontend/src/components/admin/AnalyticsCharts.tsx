'use client';

type Point = { label: string; value: number };

export function StatCard({
  label,
  value,
  growth,
  hint,
}: {
  label: string;
  value: string | number;
  growth?: number;
  hint?: string;
}) {
  const up = (growth ?? 0) >= 0;
  return (
    <div className="rounded-2xl bg-white border hairline p-5 shadow-sm">
      <p className="text-xs text-[color:var(--ink-soft)] uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-semibold mt-2 tabular-nums">{value}</p>
      {growth !== undefined ? (
        <p className={`text-xs mt-1 flex items-center gap-1 ${up ? 'text-emerald-700' : 'text-red-700'}`}>
          <span aria-hidden>{up ? '↑' : '↓'}</span>
          {Math.abs(growth)}% vs prior period
        </p>
      ) : null}
      {hint ? <p className="text-[10px] text-[color:var(--ink-soft)] mt-1">{hint}</p> : null}
    </div>
  );
}

export function LineTrendChart({ title, points }: { title: string; points: Point[] }) {
  const slice = points.slice(-20);
  const max = Math.max(1, ...slice.map((p) => p.value));
  const w = 320;
  const h = 72;
  const step = slice.length > 1 ? w / (slice.length - 1) : w;
  const path = slice
    .map((p, i) => {
      const x = i * step;
      const y = h - (p.value / max) * (h - 8) - 4;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');

  return (
    <div className="rounded-2xl bg-white border hairline p-6 shadow-sm">
      <h3 className="font-semibold text-sm mb-3">{title}</h3>
      {slice.length < 2 ? (
        <p className="text-sm text-[color:var(--ink-soft)]">Not enough data yet.</p>
      ) : (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg h-20 text-[color:var(--saffron)]">
          <path d={path} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

export function DualBarChart({
  title,
  aLabel,
  aValue,
  bLabel,
  bValue,
}: {
  title: string;
  aLabel: string;
  aValue: number;
  bLabel: string;
  bValue: number;
}) {
  const total = Math.max(1, aValue + bValue);
  return (
    <div className="rounded-2xl bg-white border hairline p-6 shadow-sm">
      <h3 className="font-semibold text-sm mb-4">{title}</h3>
      <div className="flex h-9 rounded-lg overflow-hidden text-[10px] font-medium text-white">
        <div className="bg-emerald-500/85 flex items-center justify-center" style={{ width: `${(aValue / total) * 100}%` }}>
          {aLabel} {aValue}
        </div>
        <div className="bg-rose-400/85 flex items-center justify-center" style={{ width: `${(bValue / total) * 100}%` }}>
          {bLabel} {bValue}
        </div>
      </div>
    </div>
  );
}

export function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-24">
      <h2 className="font-semibold text-lg mb-4">{title}</h2>
      {children}
    </section>
  );
}

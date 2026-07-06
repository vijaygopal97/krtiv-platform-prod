import type { SavedItineraryRecord } from '@/lib/myItinerariesApi';

export function timeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function formatDashDate(d = new Date()): string {
  return d.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export function tripProgress(item: SavedItineraryRecord): number {
  const days = item.parsedSummary?.dayCount ?? 0;
  if (days >= 5) return 85;
  if (days >= 3) return 65;
  if (days >= 1) return 40;
  return 20;
}

export function tripStatus(progress: number): { label: string; tone: 'green' | 'amber' | 'slate' } {
  if (progress >= 70) return { label: 'Almost ready', tone: 'green' };
  if (progress >= 40) return { label: 'In progress', tone: 'amber' };
  return { label: 'Draft', tone: 'slate' };
}

export function tripDateRange(item: SavedItineraryRecord): string {
  const base = item.updatedAt || item.createdAt;
  if (!base) return 'Dates flexible';
  const start = new Date(base);
  const days = item.parsedSummary?.dayCount ?? 3;
  const end = new Date(start);
  end.setDate(end.getDate() + Math.max(days - 1, 0));
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  return `${fmt(start)}–${fmt(end)}`;
}

export function explorerLevel(tripCount: number): string {
  if (tripCount >= 8) return 'Maharashtra Master';
  if (tripCount >= 4) return 'Seasoned Explorer';
  if (tripCount >= 1) return 'Curious Traveler';
  return 'New Explorer';
}

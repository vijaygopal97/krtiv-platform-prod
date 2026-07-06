import { NextResponse } from 'next/server';
import { getSnapshotStories } from '@/data/snapshotStories';

export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json({ stories: getSnapshotStories() });
}

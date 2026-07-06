import { NextResponse } from 'next/server';
import { getTravelStories } from '@/data/travelStories';

export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json({ destinations: getTravelStories() });
}

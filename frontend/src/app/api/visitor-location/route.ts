import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function isPrivateOrLocalIp(ip: string): boolean {
  if (!ip || ip === '::1' || ip === '127.0.0.1') return true;
  if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('169.254.')) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return true;
  return false;
}

function clientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get('x-real-ip')?.trim();
  if (real) return real;
  const cf = req.headers.get('cf-connecting-ip')?.trim();
  if (cf) return cf;
  return null;
}

type IpApiResponse = {
  status?: string;
  city?: string;
  regionName?: string;
  country?: string;
};

/** Resolve visitor city from IP (server-side). Falls back to Mumbai. */
export async function GET(req: NextRequest) {
  const ip = clientIp(req);
  const query =
    ip && !isPrivateOrLocalIp(ip)
      ? `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,city,regionName,country`
      : 'http://ip-api.com/json/?fields=status,city,regionName,country';

  try {
    const res = await fetch(query, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error('geo lookup failed');
    const data = (await res.json()) as IpApiResponse;
    if (data.status === 'success' && data.city?.trim()) {
      return NextResponse.json({
        city: data.city.trim(),
        region: data.regionName?.trim() || '',
        country: data.country?.trim() || '',
        source: 'ip',
      });
    }
  } catch {
    /* fall through */
  }

  return NextResponse.json({ city: 'Mumbai', region: '', country: 'India', source: 'default' });
}

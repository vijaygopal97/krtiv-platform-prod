/**
 * Server-only: preferred video language for category pages.
 * 1) Cookie (instant for same user on refresh/navigation)
 * 2) Vercel/Cloudflare geo headers (instant when available)
 * 3) ip-api.com with in-memory cache (only when 1–2 not available)
 * Same accuracy; minimal latency when cookie or headers present.
 */

export type VideoLanguage = 'en' | 'hi' | 'mr' | 'te' | 'ta' | 'kn' | 'gu' | 'bn';

const VALID_LANGS: VideoLanguage[] = ['en', 'hi', 'mr', 'te', 'ta', 'kn', 'gu', 'bn'];
export const PREFERRED_LANG_COOKIE = 'preferred_lang';

export function parsePreferredLangCookie(value: string | undefined): VideoLanguage | null {
  if (!value || !VALID_LANGS.includes(value as VideoLanguage)) return null;
  return value as VideoLanguage;
}

/** Read client IP from request headers. Safe if headers or get is missing. */
export function getClientIp(headers: unknown): string | null {
  try {
    const h = headers as { get?(name: string): string | null } | null;
    if (!h || typeof h.get !== 'function') return null;
    const cf = h.get('cf-connecting-ip');
    if (cf) return String(cf).trim();
    const real = h.get('x-real-ip');
    if (real) return String(real).trim();
    const forwarded = h.get('x-forwarded-for');
    if (forwarded) {
      const first = String(forwarded).split(',')[0]?.trim();
      if (first) return first;
    }
  } catch {
    // ignore
  }
  return null;
}

/** Map Indian state/region (name or ISO code) to video language. Never throws. */
function regionToLanguage(regionNameOrCode: unknown): VideoLanguage | null {
  try {
    const r = String(regionNameOrCode ?? '').trim().toLowerCase();
    if (!r) return null;
    if (r.includes('karnataka') || r === 'ka' || r === 'in-ka') return 'kn';
    if (r.includes('gujarat') || r === 'gj' || r === 'in-gj') return 'gu';
    if (r.includes('west bengal') || r === 'wb' || r === 'in-wb') return 'bn';
    if (r.includes('tamil') || r === 'tn' || r === 'in-tn') return 'ta';
    if (r.includes('maharashtra') || r === 'mh' || r === 'in-mh') return 'mr';
    if (r.includes('andhra') || r === 'ap' || r === 'in-ap') return 'te';
    if (r.includes('telangana') || r === 'tg' || r === 'in-tg') return 'te';
  } catch {
    // ignore
  }
  return null;
}

const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_MAX_SIZE = 5000;
const IP_API_TIMEOUT_MS = 1500;

interface CacheEntry {
  lang: VideoLanguage;
  expiry: number;
}
const ipCache = new Map<string, CacheEntry>();

function isPrivateOrLocal(ip: string): boolean {
  if (!ip || ip === '::1' || ip === '127.0.0.1') return true;
  if (ip.startsWith('10.') || ip.startsWith('192.168.')) return true;
  if (ip.startsWith('172.')) {
    const second = ip.slice(4).split('.')[0];
    const n = parseInt(second ?? '', 10);
    if (n >= 16 && n <= 31) return true;
  }
  return false;
}

/** Resolve language from Vercel or Cloudflare geo headers (no network). Returns null if not available. Never throws. */
function getLangFromHeaders(headers: unknown): VideoLanguage | null {
  try {
    const h = headers as { get?(name: string): string | null } | null;
    if (!h || typeof h.get !== 'function') return null;
    const country = (h.get('x-vercel-ip-country') ?? h.get('cf-ipcountry') ?? '').toString().toUpperCase();
    const region = (h.get('x-vercel-ip-country-region') ?? '').toString().trim();
    if (country === 'BD') return 'bn';
    if (country && country !== 'IN') return 'en';
    if (country === 'IN' && region) {
      const lang = regionToLanguage(region);
      if (lang) return lang;
      return 'hi';
    }
    if (country === 'IN') return 'hi';
  } catch {
    // ignore
  }
  return null;
}

function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(t));
}

async function fetchLangFromIp(clientIp: string): Promise<VideoLanguage> {
  const cached = ipCache.get(clientIp);
  if (cached && cached.expiry > Date.now()) return cached.lang;

  let lang: VideoLanguage = 'en';
  try {
    const url = `http://ip-api.com/json/${encodeURIComponent(clientIp)}?fields=status,countryCode,regionName`;
    const res = await fetchWithTimeout(url, IP_API_TIMEOUT_MS);
    if (!res.ok) return lang;
    const data = (await res.json()) as { status?: string; countryCode?: string; regionName?: string };
    if (data?.status !== 'success') return lang;

    const countryCode = (data.countryCode || '').toUpperCase();
    const regionName = (data.regionName || '').trim();

    if (countryCode === 'BD') lang = 'bn';
    else if (countryCode !== 'IN') lang = 'en';
    else lang = regionToLanguage(regionName) ?? 'hi';
  } catch {
    lang = 'en';
  }

  ipCache.set(clientIp, { lang, expiry: Date.now() + CACHE_TTL_MS });
  if (ipCache.size >= CACHE_MAX_SIZE) {
    const now = Date.now();
    for (const [key, v] of ipCache.entries()) if (v.expiry <= now) ipCache.delete(key);
    if (ipCache.size >= CACHE_MAX_SIZE) ipCache.clear();
  }
  return lang;
}

export interface PreferredLanguageResult {
  lang: VideoLanguage;
  fromCookie: boolean;
}

/**
 * Resolve preferred video language: cookie → headers (Vercel/CF) → ip-api (cached).
 * Never throws; returns { lang: 'en', fromCookie: false } on any error.
 */
export async function getPreferredLanguage(
  headers: unknown,
  cookieLang: VideoLanguage | null
): Promise<PreferredLanguageResult> {
  const fallback: PreferredLanguageResult = { lang: 'en', fromCookie: false };
  try {
    if (cookieLang) return { lang: cookieLang, fromCookie: true };

    const fromHeaders = getLangFromHeaders(headers);
    if (fromHeaders !== null) return { lang: fromHeaders, fromCookie: false };

    const clientIp = getClientIp(headers);
    if (!clientIp || isPrivateOrLocal(clientIp)) return fallback;

    const lang = await fetchLangFromIp(clientIp);
    return { lang, fromCookie: false };
  } catch {
    return fallback;
  }
}

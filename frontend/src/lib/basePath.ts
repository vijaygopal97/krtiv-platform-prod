/**
 * Base path for the app: '' for root (e.g. krtiv.ai), '/kraik' for dev/staging.
 * Set NEXT_PUBLIC_BASE_PATH= for production at root domain.
 */
function envBasePath(): string | undefined {
  if (typeof process === 'undefined') return undefined;
  if (process.env.NEXT_PUBLIC_BASE_PATH !== undefined) {
    return process.env.NEXT_PUBLIC_BASE_PATH;
  }
  return undefined;
}

export const basePath = envBasePath() ?? '/kraik';

/** API prefix: matches nginx (/api) or local dev (/kraik/api via Next rewrite). */
export function getApiBase(): string {
  const fromEnv = envBasePath();
  if (fromEnv !== undefined) {
    return fromEnv ? `${fromEnv}/api` : '/api';
  }
  if (typeof window !== 'undefined') {
    const { hostname, pathname } = window.location;
    const onKrtivRoot =
      (hostname === 'krtiv.ai' || hostname === 'www.krtiv.ai') && !pathname.startsWith('/kraik');
    if (onKrtivRoot) return '/api';
  }
  return basePath ? `${basePath}/api` : '/api';
}

export function assetPath(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return basePath ? `${basePath}${p}` : p;
}

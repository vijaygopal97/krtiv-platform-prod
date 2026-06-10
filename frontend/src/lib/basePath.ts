/**
 * Base path for the app: '' for root (e.g. krtiv.ai), '/kraik' for dev/staging.
 * Set NEXT_PUBLIC_BASE_PATH= for production at root domain.
 */
export const basePath =
  typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_BASE_PATH !== undefined
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : '/kraik';

export function getApiBase(): string {
  return basePath ? `${basePath}/api` : '/api';
}

export function assetPath(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return basePath ? `${basePath}${p}` : p;
}

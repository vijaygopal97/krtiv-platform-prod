const GSI_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

export type GsiId = {
  initialize: (config: Record<string, unknown>) => void;
  renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
};

export function getGoogleIdentity(): GsiId | null {
  if (typeof window === 'undefined') return null;
  const g = (window as unknown as { google?: { accounts?: { id?: GsiId } } }).google;
  return g?.accounts?.id ?? null;
}

let loadPromise: Promise<void> | null = null;

function waitForGsi(maxMs = 12_000): Promise<void> {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      if (getGoogleIdentity()) {
        resolve();
        return;
      }
      if (Date.now() - started >= maxMs) {
        reject(new Error('Google Identity Services did not become available'));
        return;
      }
      window.setTimeout(tick, 40);
    };
    tick();
  });
}

/** Load GIS once; safe to call from multiple components. */
export function loadGoogleIdentityServices(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (getGoogleIdentity()) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GSI_SCRIPT_SRC}"]`);
    const onReady = () => {
      waitForGsi()
        .then(resolve)
        .catch((err) => {
          loadPromise = null;
          reject(err);
        });
    };

    if (existing) {
      onReady();
      return;
    }

    const script = document.createElement('script');
    script.src = GSI_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = onReady;
    script.onerror = () => {
      loadPromise = null;
      reject(new Error('Failed to load Google Identity Services script'));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

export function resolveGoogleClientId(): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  if (fromEnv) return fromEnv;
  const fallback =
    '776460659429-sjh20gea0kitvi1un3436po05pajppam.apps.googleusercontent.com';
  return fallback || null;
}

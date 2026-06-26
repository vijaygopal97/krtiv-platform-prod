const FB_SDK_SRC = 'https://connect.facebook.net/en_US/sdk.js';
const FB_API_VERSION = 'v21.0';

export type FacebookLoginStatus = 'connected' | 'not_authorized' | 'unknown';

export type FacebookAuthResponse = {
  accessToken?: string;
  userID?: string;
  expiresIn?: number;
};

export type FacebookLoginResponse = {
  status?: FacebookLoginStatus;
  authResponse?: FacebookAuthResponse | null;
};

export type FacebookSDK = {
  init: (params: {
    appId: string;
    cookie?: boolean;
    xfbml?: boolean;
    version: string;
  }) => void;
  login: (
    callback: (response: FacebookLoginResponse) => void,
    options?: { scope?: string; auth_type?: string }
  ) => void;
  getLoginStatus: (callback: (response: FacebookLoginResponse) => void) => void;
};

declare global {
  interface Window {
    FB?: FacebookSDK;
    fbAsyncInit?: () => void;
  }
}

export function getFacebookSdk(): FacebookSDK | null {
  if (typeof window === 'undefined') return null;
  return window.FB ?? null;
}

let loadPromise: Promise<void> | null = null;
let initializedAppId: string | null = null;

function initSdk(appId: string) {
  const FB = getFacebookSdk();
  if (!FB) return;
  if (initializedAppId === appId) return;
  FB.init({
    appId,
    cookie: true,
    xfbml: false,
    version: FB_API_VERSION,
  });
  initializedAppId = appId;
}

function waitForFb(maxMs = 12_000): Promise<void> {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      if (getFacebookSdk()) {
        resolve();
        return;
      }
      if (Date.now() - started >= maxMs) {
        reject(new Error('Facebook SDK did not become available'));
        return;
      }
      window.setTimeout(tick, 40);
    };
    tick();
  });
}

export function resolveFacebookAppId(): string | null {
  const id = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID?.trim();
  return id || null;
}

/** Load the Facebook JavaScript SDK once. */
export function loadFacebookSdk(appId: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  const finish = () => {
    initSdk(appId);
    return Promise.resolve();
  };

  if (getFacebookSdk()) return finish();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const done = () => {
      waitForFb()
        .then(() => {
          initSdk(appId);
          resolve();
        })
        .catch((err) => {
          loadPromise = null;
          reject(err);
        });
    };

    window.fbAsyncInit = () => done();

    const existing = document.querySelector(`script[src="${FB_SDK_SRC}"]`);
    if (existing) {
      if (getFacebookSdk()) {
        done();
      } else {
        existing.addEventListener('load', () => done(), { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = FB_SDK_SRC;
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      if (!getFacebookSdk()) done();
    };
    script.onerror = () => {
      loadPromise = null;
      reject(new Error('Failed to load Facebook SDK'));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

export function requestFacebookLogin(): Promise<string> {
  return new Promise((resolve, reject) => {
    const FB = getFacebookSdk();
    if (!FB) {
      reject(new Error('Facebook SDK is not ready'));
      return;
    }

    FB.login(
      (response) => {
        if (response.authResponse?.accessToken) {
          resolve(response.authResponse.accessToken);
          return;
        }
        if (response.status === 'not_authorized' || !response.authResponse) {
          reject(new Error('Facebook sign-in was cancelled.'));
          return;
        }
        reject(new Error('Authentication failed. Please try again.'));
      },
      { scope: 'public_profile,email', auth_type: 'rerequest' }
    );
  });
}

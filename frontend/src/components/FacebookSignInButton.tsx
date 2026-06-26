'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { authService } from '@/services/authService';
import {
  loadFacebookSdk,
  requestFacebookLogin,
  resolveFacebookAppId,
} from '@/lib/facebookIdentity';

type Props = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
  disabled?: boolean;
};

type InitState = 'loading' | 'ready' | 'unavailable';

function FacebookLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path
        fill="#ffffff"
        d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.253h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
      />
    </svg>
  );
}

export default function FacebookSignInButton({
  onSuccess,
  onError,
  disabled = false,
}: Props) {
  const appId = resolveFacebookAppId();
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const [initState, setInitState] = useState<InitState>(appId ? 'loading' : 'unavailable');
  const [loading, setLoading] = useState(false);

  const label = 'Continue with Facebook';

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  useEffect(() => {
    if (!appId) {
      setInitState('unavailable');
      return;
    }

    let cancelled = false;
    setInitState('loading');

    loadFacebookSdk(appId)
      .then(() => {
        if (!cancelled) setInitState('ready');
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('[FacebookSignIn] SDK load failed:', err);
          setInitState('unavailable');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [appId]);

  const handleClick = useCallback(async () => {
    if (disabled || loading) return;

    if (!appId || initState === 'unavailable') {
      onErrorRef.current?.(
        'Facebook sign-in is temporarily unavailable. Please try again later or use email sign-in.'
      );
      return;
    }

    if (initState !== 'ready') return;

    setLoading(true);
    try {
      const accessToken = await requestFacebookLogin();
      await authService.loginWithFacebook(accessToken);
      onSuccessRef.current?.();
    } catch (e) {
      const raw = e instanceof Error ? e.message : 'Authentication failed. Please try again.';
      const msg =
        raw.includes('cancelled') || raw.includes('canceled')
          ? 'Facebook sign-in was cancelled.'
          : raw.includes('Network') || raw.includes('fetch')
            ? 'Network error. Check your connection and try again.'
            : raw;
      onErrorRef.current?.(msg);
    } finally {
      setLoading(false);
    }
  }, [appId, disabled, loading, initState]);

  const blockClicks = disabled || loading || (appId && initState === 'loading');

  return (
    <div className="relative w-full max-w-md mx-auto h-12">
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={Boolean(blockClicks)}
        className="w-full h-12 rounded-xl flex items-center justify-center gap-3 text-[15px] font-medium text-white shadow-sm transition hover:brightness-110 active:brightness-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:brightness-100"
        style={{ backgroundColor: '#1877F2' }}
        aria-label={label}
      >
        {loading ? (
          <>
            <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Connecting…</span>
          </>
        ) : (
          <>
            <FacebookLogo />
            <span>{label}</span>
          </>
        )}
      </button>
    </div>
  );
}

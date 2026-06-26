'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { authService } from '@/services/authService';
import {
  getGoogleIdentity,
  loadGoogleIdentityServices,
  resolveGoogleClientId,
} from '@/lib/googleIdentity';

type Mode = 'signin' | 'signup';

type Props = {
  mode?: Mode;
  onSuccess?: () => void;
  onError?: (message: string) => void;
  disabled?: boolean;
};

type InitState = 'loading' | 'ready' | 'unavailable';

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden className="shrink-0">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.083 36 24 36c-5.514 0-10.217-3.72-11.85-8.73H9.18v6.55A20 20 0 0 0 24 44c10.954 0 20-8.954 20-20 0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l5.387 3.95C13.802 14.028 18.574 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657A19.96 19.96 0 0 0 24 4C15.178 4 7.55 8.942 4.694 15.91l1.612-.219z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025A19.96 19.96 0 0 0 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12 12 0 0 1-4.087 5.571l.062-.045 6.19 5.238C36.795 39.905 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

export default function GoogleSignInButton({
  mode = 'signin',
  onSuccess,
  onError,
  disabled = false,
}: Props) {
  const clientId = resolveGoogleClientId();
  const containerRef = useRef<HTMLDivElement>(null);
  const gsiHostRef = useRef<HTMLDivElement>(null);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const [initState, setInitState] = useState<InitState>(clientId ? 'loading' : 'unavailable');
  const [buttonWidth, setButtonWidth] = useState(360);
  const [loading, setLoading] = useState(false);

  const label = mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google';

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  const handleCredential = useCallback(async (credential: string) => {
    setLoading(true);
    try {
      await authService.loginWithGoogle(credential);
      onSuccessRef.current?.();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Authentication failed. Please try again.';
      onErrorRef.current?.(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      if (w > 0) setButtonWidth(Math.min(400, Math.max(40, Math.floor(w))));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!clientId) {
      console.error('[GoogleSignIn] NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured');
      setInitState('unavailable');
      return;
    }

    let cancelled = false;
    setInitState('loading');

    loadGoogleIdentityServices()
      .then(() => {
        if (cancelled) return;
        setInitState('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('[GoogleSignIn] GIS load failed:', err);
        setInitState('unavailable');
      });

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  useEffect(() => {
    if (initState !== 'ready' || !clientId || !gsiHostRef.current) return;

    const gsi = getGoogleIdentity();
    if (!gsi) {
      console.error('[GoogleSignIn] google.accounts.id missing after load');
      setInitState('unavailable');
      return;
    }

    const host = gsiHostRef.current;
    host.innerHTML = '';

    try {
      gsi.initialize({
        client_id: clientId,
        callback: (response: { credential?: string }) => {
          if (response?.credential) void handleCredential(response.credential);
          else {
            setLoading(false);
            onErrorRef.current?.('Authentication failed. Please try again.');
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        itp_support: true,
        use_fedcm_for_prompt: false,
        context: mode === 'signup' ? 'signup' : 'signin',
      });

      gsi.renderButton(host, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: mode === 'signup' ? 'signup_with' : 'signin_with',
        width: buttonWidth,
        shape: 'rectangular',
      });
    } catch (err) {
      console.error('[GoogleSignIn] renderButton failed:', err);
      setInitState('unavailable');
    }
  }, [initState, clientId, mode, buttonWidth, handleCredential]);

  if (!clientId || initState === 'unavailable') {
    return (
      <p className="text-sm text-center text-[color:var(--ink-soft)]" role="status">
        Google Login is currently unavailable.
      </p>
    );
  }

  const blockClicks = disabled || loading;

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto h-12">
      <div
        className="absolute inset-0 z-0 flex items-center justify-center gap-3 rounded-xl border hairline bg-white text-[15px] font-medium text-[color:var(--ink)] shadow-sm pointer-events-none"
        aria-hidden
      >
        {loading ? (
          <>
            <span className="inline-block w-5 h-5 border-2 border-[color:var(--ink)]/20 border-t-[color:var(--ink)] rounded-full animate-spin" />
            <span>Connecting…</span>
          </>
        ) : initState === 'loading' ? (
          <>
            <GoogleIcon />
            <span>{label}</span>
          </>
        ) : (
          <>
            <GoogleIcon />
            <span>{label}</span>
          </>
        )}
      </div>

      <div
        ref={gsiHostRef}
        className={`absolute inset-0 z-10 flex items-stretch justify-center overflow-hidden [&>div]:!w-full [&_iframe]:!w-full [&_iframe]:!min-h-12 ${
          initState === 'ready' && !blockClicks
            ? 'opacity-[0.02] cursor-pointer'
            : 'opacity-0 pointer-events-none'
        }`}
        style={{ minHeight: 48 }}
        aria-label={label}
      />

      {blockClicks && initState === 'ready' && (
        <div className="absolute inset-0 z-20 rounded-xl bg-white/50 cursor-not-allowed" aria-hidden />
      )}
    </div>
  );
}

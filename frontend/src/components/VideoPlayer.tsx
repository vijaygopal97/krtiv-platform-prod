'use client';

import { useState, useCallback, useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface VideoPlayerProps {
  /** Video source - local path or URL */
  src: string;
  /** Poster/thumbnail - custom URL takes precedence */
  thumbnailUrl?: string;
  /** Fallback when no thumbnail */
  defaultThumbnail: string;
  title: string;
  subtitle?: string;
  /** Aspect ratio class */
  aspectRatio?: 'aspect-video' | 'aspect-square' | 'aspect-[4/3]';
  /** Rounded corners */
  rounded?: 'rounded-2xl' | 'rounded-3xl' | 'rounded-xl';
  /** Lightbox mode - show in modal when clicked */
  lightbox?: boolean;
  /** When true and no thumbnailUrl: capture a frame from the video as poster (efficient, on the go) */
  generatePosterFromVideo?: boolean;
  /**
   * When set, opening the lightbox video will open this URL in a new tab when:
   * - playback has started and the user pauses (first qualifying pause per viewing), or
   * - playback reaches the end.
   */
  instagramUrl?: string;
  /** Category analytics: coalesced lightbox signals (uses native timeupdate; no polling loops). */
  lightboxEngagement?: {
    onOpen?: () => void;
    onCountedView?: () => void;
    onHeartbeat?: (currentTime: number, duration: number) => void;
    onEnded?: (currentTime: number, duration: number) => void;
    onClose?: (currentTime: number, duration: number) => void;
  };
  /** Called once the fullscreen player genuinely starts playback for this open session. */
  onPlaybackStarted?: () => void;
  /** Lets the page know when the fullscreen lightbox opens or closes. */
  onLightboxOpenChange?: (isOpen: boolean) => void;
  /** Lightweight overlay controls that sit above the fullscreen player. */
  lightboxOverlay?: ReactNode;
  /** Fits inside redesigned hero card — no on-video title; template-style play control. */
  heroEmbedded?: boolean;
}

/**
 * Production-grade video player with:
 * - Efficient streaming (preload=metadata, byte-range requests)
 * - Thumbnail: custom URL if provided, else default
 * - Lazy loading for lightbox video
 */
const CAPTURE_TIME = 1;
const CAPTURE_MAX_WIDTH = 1920;
const CAPTURE_QUALITY = 0.92;

function isAbsoluteVideoUrl(url: string): boolean {
  return typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));
}

export default function VideoPlayer({
  src,
  thumbnailUrl,
  defaultThumbnail,
  title,
  subtitle,
  aspectRatio = 'aspect-video',
  rounded = 'rounded-3xl',
  lightbox = true,
  generatePosterFromVideo = false,
  instagramUrl,
  lightboxEngagement,
  onPlaybackStarted,
  onLightboxOpenChange,
  lightboxOverlay,
  heroEmbedded = false,
}: VideoPlayerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [generatedPoster, setGeneratedPoster] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const captureRef = useRef<HTMLVideoElement | null>(null);
  const lightboxVideoRef = useRef<HTMLVideoElement | null>(null);
  const igSessionRef = useRef({ hasStarted: false, openedFromPause: false });
  const playbackStartedRef = useRef(false);

  const poster = thumbnailUrl || generatedPoster || defaultThumbnail;
  const isGeneratingPoster = Boolean(generatePosterFromVideo && !thumbnailUrl && !generatedPoster);

  useEffect(() => {
    if (!generatePosterFromVideo || thumbnailUrl || !isAbsoluteVideoUrl(src) || typeof document === 'undefined') return;
    let cancelled = false;
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.crossOrigin = 'anonymous';
    captureRef.current = video;

    const captureFrame = () => {
      if (cancelled) return;
      try {
        const w = video.videoWidth;
        const h = video.videoHeight;
        if (!w || !h) return;
        const captureW = Math.min(w, CAPTURE_MAX_WIDTH);
        const captureH = Math.round((captureW * h) / w);
        const canvas = document.createElement('canvas');
        canvas.width = captureW;
        canvas.height = captureH;
        const ctx = canvas.getContext('2d');
        if (!ctx || canvas.height <= 0) return;
        ctx.drawImage(video, 0, 0, captureW, captureH);
        const dataUrl = canvas.toDataURL('image/jpeg', CAPTURE_QUALITY);
        if (!cancelled && dataUrl) setGeneratedPoster(dataUrl);
      } catch {
        // CORS or other: keep defaultThumbnail
      }
      cleanup();
    };

    const onSeeked = captureFrame;
    const onLoadedData = () => {
      if (cancelled) return;
      const d = video.duration;
      const t = Number.isFinite(d) && d > 0 ? Math.min(CAPTURE_TIME, d * 0.1) : 0;
      video.currentTime = t;
    };
    const onError = () => cleanup();
    const timeout = window.setTimeout(() => {
      if (!cancelled) cleanup();
    }, 8000);

    const cleanup = () => {
      window.clearTimeout(timeout);
      captureRef.current = null;
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('error', onError);
      video.src = '';
      video.load();
    };

    video.addEventListener('seeked', onSeeked);
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('error', onError);
    video.src = src;
    video.load();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [src, generatePosterFromVideo, thumbnailUrl]);

  const handleClose = useCallback(() => {
    const v = lightboxVideoRef.current;
    if (v && lightboxEngagement?.onClose) {
      try {
        const d = Number.isFinite(v.duration) ? v.duration : 0;
        lightboxEngagement.onClose(v.currentTime, d);
      } catch {
        /* ignore */
      }
    }
    setIsOpen(false);
    setLoadError(false);
  }, [lightboxEngagement]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (isOpen) {
      igSessionRef.current = { hasStarted: false, openedFromPause: false };
      playbackStartedRef.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    onLightboxOpenChange?.(isOpen);
  }, [isOpen, onLightboxOpenChange]);

  useLayoutEffect(() => {
    if (!isOpen || !instagramUrl || loadError) return;
    const video = lightboxVideoRef.current;
    if (!video) return;

    const url = instagramUrl;
    const openInstagram = () => {
      window.open(url, '_blank', 'noopener,noreferrer');
    };

    const onPlaying = () => {
      igSessionRef.current.hasStarted = true;
    };

    const onPause = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const v = lightboxVideoRef.current;
          if (!v) return;
          if (v.ended) return;
          if (v.seeking) return;
          const s = igSessionRef.current;
          if (!s.hasStarted || v.currentTime < 0.25) return;
          if (s.openedFromPause) return;
          s.openedFromPause = true;
          openInstagram();
        });
      });
    };

    const onEnded = () => {
      openInstagram();
    };

    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);
    return () => {
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
    };
  }, [isOpen, instagramUrl, loadError, src]);

  useEffect(() => {
    if (!isOpen || !lightboxEngagement || loadError) return;
    const video = lightboxVideoRef.current;
    if (!video) return;
    let lastHb = 0;
    let viewSent = false;
    lightboxEngagement.onOpen?.();
    const onTime = () => {
      const now = Date.now();
      if (now - lastHb >= 12000) {
        lastHb = now;
        const d = video.duration;
        if (Number.isFinite(d) && d > 0.1) {
          lightboxEngagement.onHeartbeat?.(video.currentTime, d);
        }
      }
      if (!viewSent && video.currentTime >= 2) {
        viewSent = true;
        lightboxEngagement.onCountedView?.();
      }
    };
    const onEndedEng = () => {
      const d = Number.isFinite(video.duration) ? video.duration : 0;
      lightboxEngagement.onEnded?.(video.currentTime, d);
    };
    video.addEventListener('timeupdate', onTime);
    video.addEventListener('ended', onEndedEng);
    return () => {
      video.removeEventListener('timeupdate', onTime);
      video.removeEventListener('ended', onEndedEng);
    };
  }, [isOpen, lightboxEngagement, loadError, src]);

  return (
    <>
      <div
        onClick={() => lightbox && setIsOpen(true)}
        className={`video-player-root group relative overflow-hidden ${
          heroEmbedded
            ? 'h-full cursor-pointer'
            : `cursor-pointer shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-orange-500/30 ${lightbox ? 'cursor-pointer' : ''}`
        }`}
      >
        <div className={`relative ${heroEmbedded ? 'h-full min-h-0' : aspectRatio} bg-black/50 backdrop-blur-sm ${heroEmbedded ? 'rounded-none' : rounded} overflow-hidden`}>
          {/* Thumbnail / Poster - hide when generating to avoid flashing category image */}
          {!isGeneratingPoster && (
            <img
              src={poster}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          )}
          {/* Loading state: cool typing animation when generating poster */}
          {isGeneratingPoster && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-1.5">
                  <span className="text-white/90 font-semibold text-lg md:text-xl tracking-wide">Loading</span>
                  <span className="inline-flex gap-1">
                    <span className="w-2 h-2 bg-[#FF9933] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[#FF9933] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[#FF9933] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
                <div className="h-1 w-36 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-[#FF9933] rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          )}
          {/* Play overlay - hide when generating poster */}
          {!isGeneratingPoster && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              {heroEmbedded ? (
                <span className="relative inline-flex w-16 h-16 md:w-20 md:h-20 items-center justify-center rounded-full bg-white/95 text-[color:var(--ink)] shadow-2xl transition group-hover:scale-105">
                  <svg width="18" height="22" viewBox="0 0 22 26" fill="currentColor" aria-hidden>
                    <path d="M2 2 L20 13 L2 24 Z" />
                  </svg>
                </span>
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-maharashtra rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity animate-pulse" />
                  <div className="relative w-24 h-24 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:bg-white border-4 border-white/50">
                    <svg className="w-10 h-10 text-[#FF9933] ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          )}
          {!heroEmbedded && (
            <>
              <div className={`absolute inset-0 border-4 border-white/20 ${rounded} group-hover:border-white/40 transition-colors`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white text-xl md:text-2xl font-bold drop-shadow-lg">{title}</p>
                {subtitle && <p className="text-white/80 text-sm md:text-base mt-2 drop-shadow">{subtitle}</p>}
              </div>
            </>
          )}
          {heroEmbedded && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
          )}
        </div>
      </div>

      {/* Full-screen lightbox - rendered via portal to escape overflow/transform ancestors */}
      {lightbox && isOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex flex-col bg-black"
          style={{ top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={handleClose}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-[10002] w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white transition-all duration-200"
            aria-label="Close video"
          >
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="relative flex-1 flex items-center justify-center w-full min-h-0 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {loadError ? (
              <div className="flex flex-col items-center justify-center text-white p-8 text-center max-w-md">
                <svg className="w-20 h-20 text-white/40 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-xl font-medium">Video unavailable</p>
                <p className="text-white/70 mt-2">Please add the video file to public/videos/</p>
              </div>
            ) : (
              <video
                ref={lightboxVideoRef}
                className="w-full h-full max-w-full max-h-full object-contain"
                src={src}
                poster={poster}
                controls
                autoPlay
                playsInline
                preload="metadata"
                onError={() => setLoadError(true)}
                onLoadedMetadata={(e) => {
                  const video = e.currentTarget;
                  video.play().catch(() => {});
                }}
                onPlaying={() => {
                  if (playbackStartedRef.current) return;
                  playbackStartedRef.current = true;
                  onPlaybackStarted?.();
                }}
              >
                <track kind="captions" />
              </video>
            )}
            {!loadError && lightboxOverlay ? (
              <div className="pointer-events-none absolute inset-0 z-[10001]">
                {lightboxOverlay}
              </div>
            ) : null}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

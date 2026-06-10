'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import type { BestVideoResponse, VideoEngagementSummary } from '@/lib/signpostApi';
import { postVideoEngagement } from '@/lib/signpostApi';
import { getMyVideoReaction, putMyVideoReaction, getStoredJwt } from '@/lib/videoReaction';

const MAHARASHTRA_TOURISM_INSTAGRAM =
  'https://www.instagram.com/maharashtratourismofficial?igsh=anhlNHpkNGd1aTJv';

/** Hero category clip: requires paths + engagement for SignPost analytics. */
export type CategoryPageVideo = Omit<BestVideoResponse, 'videoPath' | 'engagement'> & {
  videoPath: string;
  engagement: VideoEngagementSummary;
  heroTitle: string;
};

function sessionKey(prefix: string, threadId: string, videoPath: string) {
  return `${prefix}:${threadId}:${videoPath}`;
}

/** Persist chosen reaction so refresh does not lose UI state or double-count on SignPost. */
function reactionStorageKey(threadId: string, videoPath: string) {
  return `krtiv_reaction:v1:${threadId}:${videoPath}`;
}

function readStoredReaction(threadId: string, videoPath: string): 'like' | 'dislike' | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = localStorage.getItem(reactionStorageKey(threadId, videoPath));
    if (v === 'like' || v === 'dislike') return v;
  } catch {
    /* private mode / disabled storage */
  }
  return null;
}

function writeStoredReaction(threadId: string, videoPath: string, value: 'like' | 'dislike' | null) {
  if (typeof window === 'undefined') return;
  try {
    const key = reactionStorageKey(threadId, videoPath);
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* quota / disabled */
  }
}

function ThumbIcon({
  active,
  direction = 'up',
  className = '',
}: {
  active: boolean;
  direction?: 'up' | 'down';
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`${className} ${direction === 'down' ? 'rotate-180' : ''}`}
      fill={active ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 9V5.8c0-1.7-1-3.3-2.6-4L7 8.2V21h11.1c.7 0 1.4-.4 1.7-1.1l2-5c.1-.2.2-.5.2-.7v-3.3c0-1-.8-1.9-1.9-1.9H14Z" />
      <path d="M7 8H3v13h4V8Z" />
    </svg>
  );
}

function ReactionButton({
  label,
  active,
  tone,
  direction = 'up',
  size = 'default',
  onClick,
}: {
  label: string;
  active: boolean;
  tone: 'like' | 'dislike';
  direction?: 'up' | 'down';
  size?: 'default' | 'overlay';
  onClick: () => void;
}) {
  const activeClasses =
    tone === 'like'
      ? 'border-[#FF9933] bg-[#FF9933] text-white shadow-lg shadow-orange-500/30'
      : 'border-red-500 bg-red-600 text-white shadow-lg shadow-red-500/25';
  const inactiveClasses =
    'border-white/15 bg-black/45 text-white/88 hover:bg-black/65 hover:border-white/30';
  const sizeClasses =
    size === 'overlay'
      ? 'h-12 w-12 md:h-14 md:w-14'
      : 'h-11 w-11';
  const iconClasses =
    size === 'overlay'
      ? 'h-5 w-5 md:h-6 md:w-6'
      : 'h-5 w-5';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`inline-flex items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${sizeClasses} ${
        active ? activeClasses : inactiveClasses
      }`}
    >
      <ThumbIcon active={active} direction={direction} className={iconClasses} />
    </button>
  );
}

export default function CategoryVideoWithEngagement({
  video,
  defaultThumbnail,
  embedded = false,
}: {
  video: CategoryPageVideo;
  defaultThumbnail: string;
  /** Fits inside redesigned hero video card without outer page margins. */
  embedded?: boolean;
}) {
  const { threadId, videoPath, category, language, url, heroTitle } = video;
  const [engagement, setEngagement] = useState<VideoEngagementSummary>(video.engagement);
  const [reaction, setReaction] = useState<'like' | 'dislike' | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showDislikeFeedback, setShowDislikeFeedback] = useState(false);
  const [feedbackDraft, setFeedbackDraft] = useState('');
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const lastSampleTimeRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    setIsLightboxOpen(false);
    setShowDislikeFeedback(false);
    setFeedbackDraft('');
    (async () => {
      if (typeof window !== 'undefined' && getStoredJwt()) {
        const r = await getMyVideoReaction(threadId, videoPath);
        if (!cancelled) setReaction(r);
      } else if (!cancelled) {
        setReaction(readStoredReaction(threadId, videoPath));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [threadId, videoPath]);

  const persistPreference = useCallback(
    async (next: 'like' | 'dislike' | null) => {
      if (typeof window === 'undefined') return;
      if (getStoredJwt()) {
        const ok = await putMyVideoReaction(threadId, videoPath, next);
        if (ok) writeStoredReaction(threadId, videoPath, null);
        else writeStoredReaction(threadId, videoPath, next);
        return;
      }
      writeStoredReaction(threadId, videoPath, next);
    },
    [threadId, videoPath]
  );

  useEffect(() => {
    setEngagement(video.engagement);
  }, [video.engagement]);

  const send = useCallback(
    async (
      event: Parameters<typeof postVideoEngagement>[1]['event'],
      extra?: Partial<Parameters<typeof postVideoEngagement>[1]>
    ) => {
      const r = await postVideoEngagement(threadId, {
        videoPath,
        category,
        languageKey: language,
        event,
        ...extra,
      });
      if (r.ok && r.engagement) setEngagement(r.engagement);
      return r.ok;
    },
    [threadId, videoPath, category, language]
  );

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const sk = sessionKey('krtiv_imp', threadId, videoPath);
    if (sessionStorage.getItem(sk)) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting && e.intersectionRatio >= 0.25);
        if (!hit) return;
        sessionStorage.setItem(sk, '1');
        void send('impression');
        obs.disconnect();
      },
      { threshold: [0, 0.25, 0.5] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [send, threadId, videoPath]);

  const lightboxEngagement = useMemo(
    () => ({
      onOpen: () => {
        lastSampleTimeRef.current = 0;
      },
      onCountedView: () => {
        const sk = sessionKey('krtiv_view', threadId, videoPath);
        if (sessionStorage.getItem(sk)) return;
        sessionStorage.setItem(sk, '1');
        void send('view');
      },
      onHeartbeat: (currentTime: number, duration: number) => {
        const prev = lastSampleTimeRef.current;
        const delta = Math.max(0, Math.min(120, currentTime - prev));
        lastSampleTimeRef.current = currentTime;
        if (delta < 0.5) return;
        void send('heartbeat', { deltaWatchSec: delta, durationSec: duration });
      },
      onEnded: (currentTime: number, duration: number) => {
        const prev = lastSampleTimeRef.current;
        const delta = Math.max(0, Math.min(120, currentTime - prev));
        lastSampleTimeRef.current = currentTime;
        if (delta >= 0.5) void send('heartbeat', { deltaWatchSec: delta, durationSec: duration });
      },
      onClose: (currentTime: number, duration: number) => {
        const prev = lastSampleTimeRef.current;
        const delta = Math.max(0, Math.min(120, currentTime - prev));
        lastSampleTimeRef.current = currentTime;
        if (delta >= 0.5) void send('heartbeat', { deltaWatchSec: delta, durationSec: duration });
      },
    }),
    [send, threadId, videoPath]
  );

  const onLike = async () => {
    if (reaction === 'like') {
      const ok = await send('unlike');
      if (ok) {
        setReaction(null);
        await persistPreference(null);
      }
      return;
    }
    if (reaction === 'dislike') {
      const u = await send('undislike');
      if (u) await persistPreference(null);
    }
    const ok = await send('like');
    if (ok) {
      setReaction('like');
      await persistPreference('like');
      setShowDislikeFeedback(false);
      setFeedbackDraft('');
    }
  };

  const onDislike = async () => {
    if (reaction === 'dislike') {
      const ok = await send('undislike');
      if (ok) {
        setReaction(null);
        await persistPreference(null);
        setShowDislikeFeedback(false);
        setFeedbackDraft('');
      }
      return;
    }
    if (reaction === 'like') {
      const ok = await send('unlike');
      if (ok) {
        await persistPreference(null);
        setReaction(null);
      }
    }
    setShowDislikeFeedback(true);
  };

  const submitDislikeWithFeedback = async () => {
    const ok = await send('dislike', { feedback: feedbackDraft.trim() || undefined });
    if (ok) {
      setReaction('dislike');
      await persistPreference('dislike');
      setShowDislikeFeedback(false);
      setFeedbackDraft('');
    }
  };

  const skipFeedbackDislike = async () => {
    const ok = await send('dislike');
    if (ok) {
      setReaction('dislike');
      await persistPreference('dislike');
      setShowDislikeFeedback(false);
      setFeedbackDraft('');
    }
  };

  const renderDislikeFeedback = (floating: boolean) => (
    <div
      className={`rounded-2xl border border-white/20 bg-black/55 backdrop-blur-md p-4 text-left text-white shadow-2xl ${
        floating ? 'w-[min(92vw,30rem)]' : 'max-w-lg mx-auto'
      }`}
    >
      <p className="text-sm mb-2 text-white/90">Tell us what felt off (optional).</p>
      <textarea
        className="w-full rounded-lg bg-black/40 border border-white/20 p-2 text-sm min-h-[80px] text-white placeholder:text-white/40"
        placeholder="Short feedback helps us improve which videos we show…"
        value={feedbackDraft}
        onChange={(e) => setFeedbackDraft(e.target.value)}
      />
      <div className="flex gap-2 mt-3 justify-end flex-wrap">
        <button
          type="button"
          className="px-3 py-1.5 rounded-lg text-sm bg-white/10 hover:bg-white/20"
          onClick={() => {
            setShowDislikeFeedback(false);
            setFeedbackDraft('');
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-3 py-1.5 rounded-lg text-sm bg-white/10 hover:bg-white/20"
          onClick={() => void skipFeedbackDislike()}
        >
          Skip
        </button>
        <button
          type="button"
          className="px-3 py-1.5 rounded-lg text-sm bg-[#FF9933] font-semibold"
          onClick={() => void submitDislikeWithFeedback()}
        >
          Submit dislike
        </button>
      </div>
    </div>
  );

  const showReactionControls = isLightboxOpen;
  const reactionControls = showReactionControls ? (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/35 px-3 py-2 backdrop-blur-xl shadow-xl">
        <ReactionButton
          label={reaction === 'like' ? 'Remove like' : 'Like this video'}
          active={reaction === 'like'}
          tone="like"
          onClick={() => void onLike()}
        />
        <ReactionButton
          label={reaction === 'dislike' ? 'Remove dislike' : 'Dislike this video'}
          active={reaction === 'dislike'}
          tone="dislike"
          direction="down"
          onClick={() => void onDislike()}
        />
      </div>
    </div>
  ) : null;

  const lightboxOverlay = showReactionControls ? (
    <>
      {/* Top-right stack — clear of native controls bar at the bottom */}
      <div
        className="pointer-events-auto absolute right-16 top-4 md:right-20 md:top-5 flex flex-col gap-2.5"
        onClick={(e) => e.stopPropagation()}
      >
        <ReactionButton
          label={reaction === 'like' ? 'Remove like' : 'Like this video'}
          active={reaction === 'like'}
          tone="like"
          size="overlay"
          onClick={() => void onLike()}
        />
        <ReactionButton
          label={reaction === 'dislike' ? 'Remove dislike' : 'Dislike this video'}
          active={reaction === 'dislike'}
          tone="dislike"
          direction="down"
          size="overlay"
          onClick={() => void onDislike()}
        />
      </div>
      {showDislikeFeedback ? (
        <div
          className="pointer-events-auto absolute left-1/2 bottom-28 md:bottom-32 -translate-x-1/2 w-[min(92vw,30rem)] px-4"
          onClick={(e) => e.stopPropagation()}
        >
          {renderDislikeFeedback(true)}
        </div>
      ) : null}
    </>
  ) : null;

  const rootClass = embedded
    ? 'relative w-full h-full'
    : 'w-full max-w-4xl mx-auto mb-8 sm:mb-12 px-2 sm:px-4 md:px-8 lg:px-16 space-y-4';

  return (
    <div ref={wrapRef} className={rootClass}>
      <VideoPlayer
        src={url}
        defaultThumbnail={defaultThumbnail}
        title={heroTitle}
        subtitle="Click to watch"
        lightbox
        heroEmbedded={embedded}
        generatePosterFromVideo
        instagramUrl={MAHARASHTRA_TOURISM_INSTAGRAM}
        lightboxEngagement={lightboxEngagement}
        onLightboxOpenChange={setIsLightboxOpen}
        lightboxOverlay={lightboxOverlay}
      />
      {/* Views still POST to SignPost for ranking; counts are visible only in the generator (eflag). */}
      {embedded && reactionControls ? (
        <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center px-3 pointer-events-none [&>*]:pointer-events-auto">
          {reactionControls}
        </div>
      ) : null}
      {!embedded && reactionControls}
      {!embedded && showDislikeFeedback && !isLightboxOpen ? renderDislikeFeedback(false) : null}
    </div>
  );
}

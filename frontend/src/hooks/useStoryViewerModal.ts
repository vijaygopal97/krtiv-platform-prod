'use client';

import { useCallback, useEffect, useRef } from 'react';

export const STORY_VIEWER_HISTORY_KEY = 'maharashtraStoryViewer';

type Options = {
  isOpen: boolean;
  onClose: () => void;
};

function safePushState() {
  try {
    window.history.pushState({ [STORY_VIEWER_HISTORY_KEY]: true }, '');
    return true;
  } catch {
    return false;
  }
}

function safeBack() {
  try {
    window.history.back();
    return true;
  } catch {
    return false;
  }
}

function safeReplaceState() {
  try {
    const prev = window.history.state;
    if (prev && typeof prev === 'object' && STORY_VIEWER_HISTORY_KEY in prev) {
      window.history.replaceState(null, '');
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Modal story viewer: pushState on open, popstate / history.back() on close,
 * restore scroll position and focus to the triggering card.
 */
export function useStoryViewerModal({ isOpen, onClose }: Options) {
  const scrollYRef = useRef(0);
  const historyPushedRef = useRef(false);
  const skipNextPopRef = useRef(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const setTrigger = useCallback((el: HTMLElement | null) => {
    triggerRef.current = el;
  }, []);

  const restorePage = useCallback(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollYRef.current, left: 0, behavior: 'auto' });
      triggerRef.current?.focus({ preventScroll: true });
    });
  }, []);

  const requestClose = useCallback(() => {
    onClose();
    restorePage();

    if (!historyPushedRef.current) return;

    historyPushedRef.current = false;
    skipNextPopRef.current = true;

    const popped = safeBack();
    if (!popped) {
      skipNextPopRef.current = false;
      safeReplaceState();
    }
  }, [onClose, restorePage]);

  useEffect(() => {
    if (!isOpen) return;
    scrollYRef.current = window.scrollY;
    if (!historyPushedRef.current) {
      historyPushedRef.current = safePushState();
    }
  }, [isOpen]);

  useEffect(() => {
    const onPopState = () => {
      if (skipNextPopRef.current) {
        skipNextPopRef.current = false;
        return;
      }
      if (!isOpenRef.current && !historyPushedRef.current) return;

      historyPushedRef.current = false;
      onClose();
      restorePage();
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [onClose, restorePage]);

  return { requestClose, setTrigger };
}

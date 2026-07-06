'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authService, type User } from '@/services/authService';
import { contentService, type ContentMap } from '@/services/contentService';
import { isCmsEditorRole } from '@/lib/cmsRoles';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type CmsContextValue = {
  content: ContentMap;
  getText: (cmsKey: string, fallback: string) => string;
  editMode: boolean;
  setEditMode: (on: boolean) => void;
  canEdit: boolean;
  user: User | null;
  saveStatus: SaveStatus;
  saveField: (cmsKey: string, value: string, valueType?: string) => Promise<void>;
  refreshContent: () => Promise<void>;
  registerEditorUser: (user: User | null) => void;
};

const CmsContext = createContext<CmsContextValue | null>(null);

const EDIT_MODE_KEY = 'krtiv_cms_edit_mode';

export function CmsProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentMap>({});
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditModeState] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const canEdit = isCmsEditorRole(user?.role);

  const refreshContent = useCallback(async () => {
    const map = await contentService.fetchPublicContent();
    setContent(map);
  }, []);

  useEffect(() => {
    refreshContent().catch(() => {});
  }, [refreshContent]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(EDIT_MODE_KEY);
    if (stored === '1') setEditModeState(true);
  }, []);

  const setEditMode = useCallback(
    (on: boolean) => {
      if (!canEdit) return;
      setEditModeState(on);
      if (typeof window !== 'undefined') {
        localStorage.setItem(EDIT_MODE_KEY, on ? '1' : '0');
      }
    },
    [canEdit]
  );

  useEffect(() => {
    if (!canEdit && editMode) setEditModeState(false);
  }, [canEdit, editMode]);

  const registerEditorUser = useCallback((next: User | null) => {
    setUser(next);
  }, []);

  const getText = useCallback(
    (cmsKey: string, fallback: string) => {
      const entry = content[cmsKey];
      if (entry?.value != null && entry.value !== '') return entry.value;
      return fallback;
    },
    [content]
  );

  const saveField = useCallback(
    async (cmsKey: string, value: string, valueType = 'text') => {
      setSaveStatus('saving');
      try {
        const result = await contentService.saveField({ cmsKey, value, valueType });
        if (!result.unchanged) {
          setContent((prev) => ({
            ...prev,
            [cmsKey]: { ...(prev[cmsKey] || {}), value, valueType },
          }));
        }
        setSaveStatus('saved');
        window.setTimeout(() => setSaveStatus('idle'), 2200);
      } catch {
        setSaveStatus('error');
        window.setTimeout(() => setSaveStatus('idle'), 3000);
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      content,
      getText,
      editMode,
      setEditMode,
      canEdit,
      user,
      saveStatus,
      saveField,
      refreshContent,
      registerEditorUser,
    }),
    [
      content,
      getText,
      editMode,
      setEditMode,
      canEdit,
      user,
      saveStatus,
      saveField,
      refreshContent,
      registerEditorUser,
    ]
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error('useCms must be used within CmsProvider');
  return ctx;
}

export function useCmsOptional() {
  return useContext(CmsContext);
}

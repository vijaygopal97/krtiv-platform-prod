'use client';

import dynamic from 'next/dynamic';
import { CmsProvider } from '@/components/cms/CmsContext';
import { CmsSaveToast } from '@/components/cms/CmsSaveToast';
import { CmsPageMeta } from '@/components/cms/CmsPageMeta';
import { SavedPlacesHydrator } from '@/components/places/SavedPlacesHydrator';
import { MobileNavProvider } from '@/components/navigation/MobileNavContext';
import { MobileBottomNavShell } from '@/components/navigation/MobileBottomNavShell';
import '@/styles/cms-inline-editor.css';
import '@/styles/mobile-bottom-nav.css';

const PageSeoPanel = dynamic(
  () => import('@/components/cms/PageSeoPanel').then((m) => m.PageSeoPanel),
  { ssr: false }
);

export function CmsClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <CmsProvider>
      <MobileNavProvider>
        {children}
        <SavedPlacesHydrator />
        <MobileBottomNavShell />
        <CmsPageMeta />
        <CmsSaveToast />
        <PageSeoPanel />
      </MobileNavProvider>
    </CmsProvider>
  );
}

'use client';

import dynamic from 'next/dynamic';
import { CmsProvider } from '@/components/cms/CmsContext';
import { CmsSaveToast } from '@/components/cms/CmsSaveToast';
import { CmsPageMeta } from '@/components/cms/CmsPageMeta';
import { SavedPlacesHydrator } from '@/components/places/SavedPlacesHydrator';
import '@/styles/cms-inline-editor.css';

const PageSeoPanel = dynamic(
  () => import('@/components/cms/PageSeoPanel').then((m) => m.PageSeoPanel),
  { ssr: false }
);

export function CmsClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <CmsProvider>
      {children}
      <SavedPlacesHydrator />
      <CmsPageMeta />
      <CmsSaveToast />
      <PageSeoPanel />
    </CmsProvider>
  );
}

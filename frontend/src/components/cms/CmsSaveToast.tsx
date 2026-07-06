'use client';

import { useCms } from '@/components/cms/CmsContext';

export function CmsSaveToast() {
  const { saveStatus, canEdit } = useCms();
  if (!canEdit || saveStatus === 'idle') return null;

  const label =
    saveStatus === 'saving'
      ? 'Saving…'
      : saveStatus === 'saved'
        ? '✅ Saved successfully'
        : 'Could not save — try again';

  return (
    <div className="cms-save-toast" role="status" aria-live="polite">
      {label}
    </div>
  );
}

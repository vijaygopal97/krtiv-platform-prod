'use client';

import { useCallback, useState } from 'react';
import { useCmsOptional } from '@/components/cms/CmsContext';
import { contentService } from '@/services/contentService';
import { assetPath } from '@/lib/basePath';

type Props = {
  cmsKey: string;
  defaultSrc: string;
  alt?: string;
  className?: string;
};

export function EditableImage({ cmsKey, defaultSrc, alt = '', className }: Props) {
  const cms = useCmsOptional();
  const stored = cms?.getText(cmsKey, defaultSrc) ?? defaultSrc;
  const src = stored.startsWith('/') ? assetPath(stored) : stored;
  const interactive = cms?.canEdit && cms.editMode;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const onDoubleClick = useCallback(() => {
    if (!interactive) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      setPendingFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    };
    input.click();
  }, [interactive]);

  const confirmSave = async () => {
    if (!pendingFile || !cms) return;
    setUploading(true);
    try {
      const url = await contentService.uploadMedia(pendingFile);
      await cms.saveField(cmsKey, url, 'image');
      setPreviewUrl(null);
      setPendingFile(null);
    } finally {
      setUploading(false);
    }
  };

  const cancelPreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPendingFile(null);
  };

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={previewUrl || src}
        alt={alt}
        className={[className, interactive ? 'cms-editable cms-editable--media' : ''].filter(Boolean).join(' ')}
        onDoubleClick={onDoubleClick}
        data-cms-key={cmsKey}
      />
      {previewUrl ? (
        <div className="cms-media-preview" role="dialog" aria-modal="true">
          <p className="cms-media-preview__title">Preview before saving</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="" className="cms-media-preview__img" />
          <div className="cms-inline-editor__actions">
            <button type="button" className="cms-inline-editor__btn cms-inline-editor__btn--ghost" onClick={cancelPreview}>
              Cancel
            </button>
            <button type="button" className="cms-inline-editor__btn" disabled={uploading} onClick={confirmSave}>
              {uploading ? 'Saving…' : 'Save image'}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

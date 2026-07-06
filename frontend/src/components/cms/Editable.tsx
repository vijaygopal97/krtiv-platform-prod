'use client';

import dynamic from 'next/dynamic';
import {
  createElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
} from 'react';
import { useCmsOptional } from '@/components/cms/CmsContext';

const InlineRichEditor = dynamic(
  () => import('@/components/cms/InlineRichEditor').then((m) => m.InlineRichEditor),
  { ssr: false }
);

type EditableProps = {
  cmsKey: string;
  defaultValue: string;
  as?: ElementType;
  richHtml?: boolean;
  valueType?: 'text' | 'html' | 'seo';
  className?: string;
  style?: CSSProperties;
} & Omit<HTMLAttributes<HTMLElement>, 'children' | 'defaultValue'>;

function PlainTextEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial: string;
  onSave: (v: string) => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, []);

  return (
    <div className="cms-inline-editor" onClick={(e) => e.stopPropagation()}>
      <textarea
        ref={ref}
        className="cms-inline-editor__textarea"
        defaultValue={initial}
        rows={2}
        onInput={(e) => {
          const t = e.currentTarget;
          t.style.height = 'auto';
          t.style.height = `${t.scrollHeight}px`;
        }}
      />
      <div className="cms-inline-editor__actions">
        <button type="button" className="cms-inline-editor__btn cms-inline-editor__btn--ghost" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className="cms-inline-editor__btn"
          onClick={() => onSave(ref.current?.value.trim() ?? '')}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export function Editable({
  cmsKey,
  defaultValue,
  as = 'span',
  richHtml = false,
  valueType = 'text',
  className = '',
  style,
  ...rest
}: EditableProps) {
  const cms = useCmsOptional();
  const display = cms?.getText(cmsKey, defaultValue) ?? defaultValue;
  const [editing, setEditing] = useState(false);

  const interactive = cms?.canEdit && cms.editMode;

  const startEdit = useCallback(() => {
    if (!interactive) return;
    setEditing(true);
  }, [interactive]);

  const handleSave = useCallback(
    async (value: string) => {
      setEditing(false);
      await cms?.saveField(cmsKey, value, richHtml ? 'html' : valueType);
    },
    [cms, cmsKey, richHtml, valueType]
  );

  if (editing && interactive) {
    return richHtml ? (
      <InlineRichEditor initialHtml={display} onSave={handleSave} onCancel={() => setEditing(false)} />
    ) : (
      <PlainTextEditor initial={display} onSave={handleSave} onCancel={() => setEditing(false)} />
    );
  }

  const mergedClass = [className, interactive ? 'cms-editable' : ''].filter(Boolean).join(' ');

  if (richHtml) {
    return createElement(as, {
      ...rest,
      className: mergedClass,
      style,
      onDoubleClick: startEdit,
      dangerouslySetInnerHTML: { __html: display },
      'data-cms-key': cmsKey,
    });
  }

  return createElement(
    as,
    {
      ...rest,
      className: mergedClass,
      style,
      onDoubleClick: startEdit,
      'data-cms-key': cmsKey,
    },
    display
  );
}

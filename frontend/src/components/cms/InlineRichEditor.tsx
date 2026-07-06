'use client';

import { useCallback, useEffect, useRef } from 'react';

type Props = {
  initialHtml: string;
  onSave: (html: string) => void;
  onCancel: () => void;
};

export function InlineRichEditor({ initialHtml, onSave, onCancel }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    el.innerHTML = initialHtml;
    el.focus();
  }, [initialHtml]);

  const exec = useCallback((cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  }, []);

  return (
    <div className="cms-inline-editor" onClick={(e) => e.stopPropagation()}>
      <div className="cms-inline-editor__toolbar" role="toolbar" aria-label="Formatting">
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('bold')}>
          B
        </button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('italic')}>
          I
        </button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('underline')}>
          U
        </button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('insertUnorderedList')}>
          •
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const url = window.prompt('Link URL');
            if (url) exec('createLink', url);
          }}
        >
          Link
        </button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('undo')}>
          Undo
        </button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('redo')}>
          Redo
        </button>
      </div>
      <div
        ref={editorRef}
        className="cms-inline-editor__field"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline
      />
      <div className="cms-inline-editor__actions">
        <button type="button" className="cms-inline-editor__btn cms-inline-editor__btn--ghost" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className="cms-inline-editor__btn"
          onClick={() => onSave(editorRef.current?.innerHTML.trim() || '')}
        >
          Save
        </button>
      </div>
    </div>
  );
}

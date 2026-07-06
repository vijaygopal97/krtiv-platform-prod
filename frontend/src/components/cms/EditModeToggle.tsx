'use client';

import { useCmsOptional } from '@/components/cms/CmsContext';

export function EditModeToggle() {
  const cms = useCmsOptional();
  if (!cms?.canEdit) return null;

  return (
    <label className="cms-edit-toggle" title="Enable inline content editing">
      <input
        type="checkbox"
        checked={cms.editMode}
        onChange={(e) => cms.setEditMode(e.target.checked)}
        className="cms-edit-toggle__input"
      />
      <span className="cms-edit-toggle__track" aria-hidden />
      <span className="cms-edit-toggle__label">Edit mode</span>
    </label>
  );
}

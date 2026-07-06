/** Roles that may use inline CMS (matches backend). */
export const CMS_EDITOR_ROLES = ['admin', 'super_admin', 'content_admin'] as const;

export type CmsEditorRole = (typeof CMS_EDITOR_ROLES)[number];

export function isCmsEditorRole(role?: string | null): boolean {
  return CMS_EDITOR_ROLES.includes(role as CmsEditorRole);
}

export function isSuperAdminRole(role?: string | null): boolean {
  return role === 'admin' || role === 'super_admin';
}

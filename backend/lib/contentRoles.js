/** Roles allowed to use inline CMS and admin content APIs. Legacy `admin` = super admin. */
export const CMS_EDITOR_ROLES = new Set(['admin', 'super_admin', 'content_admin']);

export function isCmsEditorRole(role) {
  return CMS_EDITOR_ROLES.has(role || 'user');
}

export function isSuperAdminRole(role) {
  return role === 'admin' || role === 'super_admin';
}

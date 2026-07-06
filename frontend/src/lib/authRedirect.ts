export const PROTECTED_FROM_VALUE = 'protected';

/**
 * Centralized post-auth redirect logic:
 * - Default landing is home (/)
 * - Only honor `next` when request came from a protected route guard
 */
export function resolvePostAuthRedirect(params: URLSearchParams): string {
  const from = params.get('from');
  const next = params.get('next');
  if (from === PROTECTED_FROM_VALUE && next?.startsWith('/')) {
    return next;
  }
  return '/';
}

export function buildAuthLink(
  target: '/login' | '/register',
  params: URLSearchParams,
): string {
  const from = params.get('from');
  const next = params.get('next');
  if (from === PROTECTED_FROM_VALUE && next?.startsWith('/')) {
    return `${target}?next=${encodeURIComponent(next)}&from=${PROTECTED_FROM_VALUE}`;
  }
  return target;
}

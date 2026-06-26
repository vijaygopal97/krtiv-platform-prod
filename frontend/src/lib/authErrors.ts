/** Map API responses to user-safe messages (no env names or stack traces). */
export function friendlyAuthMessage(
  status: number,
  serverMessage?: string,
  provider: 'google' | 'facebook' = 'google'
): string {
  const providerLabel = provider === 'facebook' ? 'Facebook' : 'Google';
  const msg = (serverMessage || '').toLowerCase();
  if (status === 503 || msg.includes('not configured') || msg.includes('unavailable')) {
    return `${providerLabel} sign-in is temporarily unavailable. Please try again later or use email sign-in.`;
  }
  if (status === 401) {
    return 'Authentication failed. Please try again or use a different account.';
  }
  if (status === 400) {
    if (serverMessage && msg.includes('email')) return serverMessage;
    return 'We could not complete sign-in. Please try again.';
  }
  if (status === 502 || msg.includes('network')) {
    return 'Network error. Check your connection and try again.';
  }
  if (status >= 500) {
    return 'Something went wrong on our side. Please try again in a few minutes.';
  }
  if (
    serverMessage &&
    !serverMessage.includes('GOOGLE_') &&
    !serverMessage.includes('FACEBOOK_') &&
    !serverMessage.includes('JWT')
  ) {
    return serverMessage;
  }
  return 'Authentication failed. Please try again.';
}

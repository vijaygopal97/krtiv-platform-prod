const GRAPH = 'https://graph.facebook.com/v21.0';

function getAppCredentials() {
  const appId = process.env.FACEBOOK_APP_ID || process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  return { appId, appSecret };
}

/**
 * Verify user access token and return profile fields from Graph API.
 * @returns {{ facebookId: string, email: string, name: string, profilePicture: string }}
 */
export async function verifyFacebookAccessToken(accessToken) {
  const { appId, appSecret } = getAppCredentials();
  if (!appId || !appSecret) {
    const err = new Error('Facebook sign-in is not configured');
    err.code = 'NOT_CONFIGURED';
    throw err;
  }
  if (!accessToken || typeof accessToken !== 'string') {
    const err = new Error('Invalid access token');
    err.code = 'INVALID_TOKEN';
    throw err;
  }

  const appAccessToken = `${appId}|${appSecret}`;
  const debugUrl = new URL(`${GRAPH}/debug_token`);
  debugUrl.searchParams.set('input_token', accessToken);
  debugUrl.searchParams.set('access_token', appAccessToken);

  let debugJson;
  try {
    const debugRes = await fetch(debugUrl);
    debugJson = await debugRes.json();
  } catch (e) {
    const err = new Error('Network error while verifying Facebook login');
    err.code = 'NETWORK';
    throw err;
  }

  const data = debugJson?.data;
  if (!data?.is_valid) {
    const err = new Error('Invalid or expired Facebook token');
    err.code = 'INVALID_TOKEN';
    throw err;
  }
  if (String(data.app_id) !== String(appId)) {
    const err = new Error('Facebook token was not issued for this application');
    err.code = 'INVALID_TOKEN';
    throw err;
  }

  const meUrl = new URL(`${GRAPH}/me`);
  meUrl.searchParams.set('fields', 'id,name,email,picture.type(large)');
  meUrl.searchParams.set('access_token', accessToken);

  let meJson;
  try {
    const meRes = await fetch(meUrl);
    meJson = await meRes.json();
  } catch (e) {
    const err = new Error('Network error while loading your Facebook profile');
    err.code = 'NETWORK';
    throw err;
  }

  if (meJson?.error) {
    const err = new Error(meJson.error.message || 'Facebook API error');
    err.code = 'FACEBOOK_API';
    throw err;
  }

  const facebookId = meJson.id;
  const email = (meJson.email || '').toLowerCase().trim();
  const name = (meJson.name || '').trim() || (email ? email.split('@')[0] : 'Facebook User');
  const profilePicture = meJson.picture?.data?.url || '';

  if (!facebookId) {
    const err = new Error('Could not read your Facebook profile');
    err.code = 'FACEBOOK_API';
    throw err;
  }
  if (!email) {
    const err = new Error(
      'We need your email to sign in. Please allow email access on Facebook or use email sign-in.'
    );
    err.code = 'MISSING_EMAIL';
    throw err;
  }

  return { facebookId, email, name, profilePicture };
}

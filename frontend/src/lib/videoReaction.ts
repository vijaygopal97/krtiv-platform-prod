/**
 * Per-user video like/dislike preference (Krtiv MongoDB). SignPost still holds aggregate counts.
 * JWT is sent in the JSON body as `authToken` so it survives proxies that strip Authorization.
 */
import { getApiBase } from '@/lib/basePath';

/** Non-empty JWT from login `user` in localStorage, or null (guest / incomplete session). */
export function getStoredJwt(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const u = JSON.parse(raw) as { token?: string };
    const t = u?.token;
    return typeof t === 'string' && t.length > 0 ? t : null;
  } catch {
    return null;
  }
}

function postVideoReactionBody(
  op: 'get' | 'set',
  threadId: string,
  videoPath: string,
  authToken: string,
  reaction?: 'like' | 'dislike' | null
) {
  const body: Record<string, unknown> = {
    op,
    threadId,
    videoPath,
    authToken,
  };
  if (op === 'set') body.reaction = reaction;
  return JSON.stringify(body);
}

export async function getMyVideoReaction(
  threadId: string,
  videoPath: string
): Promise<'like' | 'dislike' | null> {
  const authToken = getStoredJwt();
  if (!authToken) return null;
  const base = getApiBase().replace(/\/$/, '');
  const res = await fetch(`${base}/me/video-reaction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: postVideoReactionBody('get', threadId, videoPath, authToken),
    cache: 'no-store',
  });
  if (res.status === 401) return null;
  if (!res.ok) return null;
  const data = (await res.json().catch(() => ({}))) as { reaction?: string };
  return data.reaction === 'like' || data.reaction === 'dislike' ? data.reaction : null;
}

export async function putMyVideoReaction(
  threadId: string,
  videoPath: string,
  reaction: 'like' | 'dislike' | null
): Promise<boolean> {
  const authToken = getStoredJwt();
  if (!authToken) return false;
  const base = getApiBase().replace(/\/$/, '');
  const res = await fetch(`${base}/me/video-reaction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: postVideoReactionBody('set', threadId, videoPath, authToken, reaction),
  });
  return res.ok;
}

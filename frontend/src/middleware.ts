import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Prevent caching of HTML/document so after deploy users get fresh chunk URLs.
 * Static assets (_next/static) are left untouched (immutable).
 */
export function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const pathname = request.nextUrl.pathname || '';

  if (pathname.includes('/_next/static/')) {
    return res;
  }
  res.headers.set('Cache-Control', 'no-store, must-revalidate');
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};

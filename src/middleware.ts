import { NextResponse, type NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export const middleware = (request: NextRequest) => {
  if (request.nextUrl.pathname === '/admin/login') return NextResponse.next();

  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/admin/:path*'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require the user to be logged in
const PROTECTED = ['/dashboard', '/insights', '/profile', '/input'];
// /admin removed — has its own password protection via BOSS_ADMIN_SECRET

// Routes only for logged-out users — redirect to dashboard if already logged in
const AUTH_ONLY = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('token')?.value;

  const isProtected = PROTECTED.some((path) => pathname.startsWith(path));
  const isAuthOnly = AUTH_ONLY.some((path) => pathname.startsWith(path));

  // Not logged in, trying to access a protected page → send to login
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in, trying to access login/register → send to dashboard
  if (isAuthOnly && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/insights/:path*',
    '/profile/:path*',
    '/input/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
};

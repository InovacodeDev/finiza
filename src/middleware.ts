import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/account',
  '/accounts',
  '/credit-cards',
  '/investments',
  '/invoices',
  '/settings',
  '/transactions'
];

const AUTH_PATH = '/auth';
const DASHBOARD_PATH = '/dashboard';

export async function middleware(request: NextRequest) {
  const { user, supabaseResponse } = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Precise route matching check to avoid /dashboard-extra matches
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAuthPage = pathname.startsWith(AUTH_PATH);

  // REDIRECT 1: Unauthenticated users from protected routes to login
  if (!user && isProtectedRoute) {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[AUTH] Redirecting unauthenticated user from ${pathname} to ${AUTH_PATH}`);
    }
    const url = request.nextUrl.clone();
    url.pathname = AUTH_PATH;
    return NextResponse.redirect(url);
  }

  // REDIRECT 2: Authenticated users away from login pages (Reverse Auth)
  if (user && isAuthPage) {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[AUTH] Redirecting authenticated user from ${pathname} to ${DASHBOARD_PATH}`);
    }
    const url = request.nextUrl.clone();
    url.pathname = DASHBOARD_PATH;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (static assets folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

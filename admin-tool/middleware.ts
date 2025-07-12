import { NextRequest, NextResponse } from 'next/server';
import { Locale } from './i18n/config';
import { COOKIE_NAME } from './services/locale';

export const ROOT = '/';
export const PUBLIC_ROUTES = [
  '/auth/(signin|signout|error)',
  '/onboarding/(setup|initialAdmin)',
  '/api/setupConfig',
];
export const DEFAULT_REDIRECT = '/auth/signin';
export const defaultLocale = 'de';
export const locales = ['en', 'de', 'fr', 'it', 'es'];

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|onboarding).*)'],
};

export default async function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('user');
  const tokenCookie = request.cookies.get('token');
  let session: any = null;
  if (userCookie) {
    try {
      const parsed = JSON.parse(userCookie.value);
      const createdAt = new Date(parsed.createdAt);
      const ageMinutes = (Date.now() - createdAt.getTime()) / 1000 / 60;
      if (ageMinutes < 30) {
        session = { user: JSON.parse(parsed.data) };
      }
    } catch (err) {
      console.error('Error parsing user cookie:', err);
      session = null;
    }
  }
  const isAuthenticated = !!(session?.user && tokenCookie?.value);
  console.warn('Middleware session:', session);
  console.warn('Middleware isAuthenticated:', isAuthenticated);
  const { origin, pathname } = request.nextUrl;

  // Locale detection
  const acceptLanguage = request.headers.get('accept-language');
  const extractedLocale = acceptLanguage?.match(/^[a-z]{2}/i)?.[0];
  const locale = locales.includes(extractedLocale || '')
    ? (extractedLocale as Locale)
    : (defaultLocale as Locale);

  let userLocale = request.cookies.get(COOKIE_NAME)?.value as Locale | undefined;
  if (!userLocale) {
    userLocale = locale;
  }

  // Setup config API check
  // let isConfigured = false;
  // try {
  //   const response = await fetch('http://localhost:3333/api/siteConfig');
  //   const siteConfig = await response.json();
  //  isConfigured = !!siteConfig?.isConfigured;
  // } catch (error) {
  //   console.error('Error fetching site config:', error);
  //   }
  // if (!isConfigured) {
  //   return NextResponse.redirect(new URL('/api/setupConfig', origin));
  // }
  // Check if the user is authenticated

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    new RegExp(route).test(pathname)
  );

  // ✅ 2. Allow public routes without redirect
  if (isPublicRoute) {
    const response = NextResponse.next();
    response.cookies.set(COOKIE_NAME, userLocale);
    response.headers.set('x-user-locale', userLocale);
    return response;
  }

  // 🔐 3. Redirect unauthenticated users to login
  if (!isAuthenticated) {
    const response = NextResponse.redirect(new URL(DEFAULT_REDIRECT, origin));
    response.cookies.set(COOKIE_NAME, userLocale);
    response.headers.set('x-user-locale', userLocale);
    return response;
  }

  // 🔁 4. Prevent authenticated users from accessing login pages again
  if (isAuthenticated && pathname.startsWith('/auth')) {
    const response = NextResponse.redirect(new URL(ROOT, origin));
    response.cookies.set(COOKIE_NAME, userLocale);
    response.headers.set('x-user-locale', userLocale);
    return response;
  }

  // ✅ 5. All other valid requests
  const response = NextResponse.next();
  response.cookies.set(COOKIE_NAME, userLocale);
  response.headers.set('x-user-locale', userLocale);
  return response;
}

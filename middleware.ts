import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const SUPPORTED_LOCALES = ['ko', 'en'];
const DEFAULT_LOCALE = 'ko';

function getLocaleFromHeader(request: NextRequest): string {
  const lang = request.headers.get('accept-language')?.split(',')[0];
  if (lang?.startsWith('en')) return 'en';
  if (lang?.startsWith('ko')) return 'ko';
  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 정적 파일, API, locale 경로는 무시
  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith('/api') ||
    SUPPORTED_LOCALES.some((locale) => pathname.startsWith(`/${locale}`))
  ) {
    return;
  }

  const locale = getLocaleFromHeader(request);

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|images|fonts|api).*)'],
};
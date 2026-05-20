import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  localePrefix: 'as-needed'
});

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // 1. Admin Authentication Logic
  if (path.startsWith("/admin")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (path === "/admin/login" && token?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (path !== "/admin/login") {
      if (!token || token.role !== "admin") {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }
    // Skip i18n for admin routes
    return NextResponse.next();
  }

  // 2. i18n Routing Logic for Storefront
  return intlMiddleware(req);
}

export const config = {
  // Skip all internal paths (_next, api)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // 1. استخرج التوكن يدوياً
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 2. لو هو في صفحة اللوجن ومعاه توكن أدمن، وديه للوحة التحكم
  if (path === "/admin/login" && token?.role === "admin") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // 3. لو بيحاول يدخل أي حاجة في /admin (مش اللوجن) وهو مش أدمن، وديه للوجن
  if (path.startsWith("/admin") && path !== "/admin/login") {
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
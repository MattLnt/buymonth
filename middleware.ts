import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: process.env.NODE_ENV === "production" 
      ? "__Secure-next-auth.session-token" 
      : "next-auth.session-token"
  });
  
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard/vendeur")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    if (token.role !== "VENDEUR") return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/dashboard/acheteur")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    if (token.role !== "ACHETEUR") return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/dashboard/admin")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    if (token.role !== "ADMIN") return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login" || pathname === "/api/admin/login") return NextResponse.next();

  const token = req.cookies.get("admin_session")?.value;
  let ok = false;
  if (token) {
    try { await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret")); ok = true; } catch {}
  }
  if (ok) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };

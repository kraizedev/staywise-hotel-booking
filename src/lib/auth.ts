import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const COOKIE = "admin_session";
const key = () => new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret");

export async function createSession(adminId: string) {
  const token = await new SignJWT({ sub: adminId }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(key());
  cookies().set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 604800 });
}

export async function isAdmin() {
  const t = cookies().get(COOKIE)?.value;
  if (!t) return false;
  try { await jwtVerify(t, key()); return true; } catch { return false; }
}

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const admin = await prisma.admin.findUnique({ where: { email: String(email) } });
  if (!admin || !(await bcrypt.compare(String(password), admin.passwordHash)))
    return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
  await createSession(admin.id);
  return NextResponse.json({ ok: true });
}

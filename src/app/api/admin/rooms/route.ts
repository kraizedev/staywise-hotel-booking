import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { roomSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  let input: unknown;
  try { input = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const p = roomSchema.safeParse(input);
  if (!p.success) return NextResponse.json({ error: "Invalid room data" }, { status: 400 });
  return NextResponse.json(await prisma.roomType.create({ data: p.data }), { status: 201 });
}

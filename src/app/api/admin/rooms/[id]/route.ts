import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { roomSchema } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  let input: unknown;
  try { input = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const p = roomSchema.partial().safeParse(input);
  if (!p.success) return NextResponse.json({ error: "Invalid room data" }, { status: 400 });
  try {
    return NextResponse.json(await prisma.roomType.update({ where: { id }, data: p.data }));
  } catch {
    return NextResponse.json({ error: "Room not found." }, { status: 404 });
  }
}

// Rooms with bookings cannot be deleted; deactivate them instead.
export async function DELETE(_: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  if (await prisma.booking.count({ where: { roomTypeId: id } }))
    return NextResponse.json({ error: "Room has bookings. Deactivate it instead." }, { status: 409 });
  try {
    await prisma.roomType.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Room not found." }, { status: 404 });
  }
}

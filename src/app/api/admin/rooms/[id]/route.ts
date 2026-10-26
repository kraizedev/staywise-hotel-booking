import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { roomSchema } from "../route";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const p = roomSchema.partial().safeParse(await req.json());
  if (!p.success) return NextResponse.json({ error: "Invalid room data" }, { status: 400 });
  return NextResponse.json(await prisma.roomType.update({ where: { id: params.id }, data: p.data }));
}

// Rooms with bookings can't be deleted; deactivate them instead (PATCH active:false)
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (await prisma.booking.count({ where: { roomTypeId: params.id } }))
    return NextResponse.json({ error: "Room has bookings. Deactivate it instead." }, { status: 409 });
  await prisma.roomType.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Cancel a booking (frees the room for those dates)
export async function PATCH(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.booking.update({ where: { id: params.id }, data: { status: "CANCELLED" } });
  return NextResponse.json({ ok: true });
}

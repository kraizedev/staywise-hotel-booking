import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Cancel a booking (frees the room for those dates)
export async function PATCH(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.booking.update({ where: { id }, data: { status: "CANCELLED" } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
}

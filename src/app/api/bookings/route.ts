import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { unitsLeft } from "@/lib/availability";
import { isValidDate, nightsBetween, toDate } from "@/lib/dates";

const schema = z.object({
  roomTypeId: z.string().min(1),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().int().min(1).max(20),
  guestName: z.string().trim().min(2).max(120),
  guestEmail: z.string().trim().email().max(254),
  guestPhone: z.string().trim().min(5).max(40),
  requests: z.string().trim().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  let input: unknown;
  try { input = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const parsed = schema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
  const d = parsed.data;
  if (!isValidDate(d.checkIn) || !isValidDate(d.checkOut))
    return NextResponse.json({ error: "Choose valid dates." }, { status: 400 });

  const checkIn = toDate(d.checkIn), checkOut = toDate(d.checkOut);
  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1 || checkIn < toDate(new Date().toISOString().slice(0, 10)))
    return NextResponse.json({ error: "Choose valid future dates and a check-out after check-in." }, { status: 400 });

  try {
    const booking = await prisma.$transaction(async (tx) => {
      // Serialize bookings for this room type to prevent concurrent overbooking.
      await tx.$queryRaw`SELECT "id" FROM "RoomType" WHERE "id" = ${d.roomTypeId} FOR UPDATE`;
      const rt = await tx.roomType.findUnique({ where: { id: d.roomTypeId } });
      if (!rt || !rt.active) throw new Error("NOT_FOUND");
      if (d.guests > rt.capacity) throw new Error("CAPACITY");
      if ((await unitsLeft(tx, rt.id, checkIn, checkOut)) < 1) throw new Error("SOLD_OUT");
      return tx.booking.create({
        data: {
          reference: randomBytes(8).toString("hex").toUpperCase(),
          roomTypeId: rt.id, guestName: d.guestName, guestEmail: d.guestEmail, guestPhone: d.guestPhone,
          guests: d.guests, requests: d.requests || null, checkIn, checkOut, totalPrice: nights * rt.pricePerNight,
        },
      });
    });
    return NextResponse.json({ reference: booking.reference }, { status: 201 });
  } catch (e: unknown) {
    const code = e instanceof Error ? e.message : "";
    const messages: Record<string, string> = {
      SOLD_OUT: "Sorry, this room is no longer available for those dates.",
      CAPACITY: "Too many guests for this room.",
      NOT_FOUND: "Room not found.",
    };
    return NextResponse.json({ error: messages[code] ?? "Something went wrong." }, { status: code in messages ? 409 : 500 });
  }
}

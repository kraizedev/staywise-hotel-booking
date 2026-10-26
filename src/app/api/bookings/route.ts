import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { unitsLeft } from "@/lib/availability";
import { nightsBetween, toDate } from "@/lib/dates";

const schema = z.object({
  roomTypeId: z.string(),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.number().int().min(1),
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(5),
  requests: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
  const d = parsed.data;
  const checkIn = toDate(d.checkIn), checkOut = toDate(d.checkOut);
  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1 || checkIn < toDate(new Date().toISOString().slice(0, 10)))
    return NextResponse.json({ error: "Choose valid dates." }, { status: 400 });

  try {
    const booking = await prisma.$transaction(async (tx) => {
      // Lock the room type row so concurrent bookings are serialized (no double-booking)
      await tx.$queryRaw`SELECT id FROM "RoomType" WHERE id = ${d.roomTypeId} FOR UPDATE`;
      const rt = await tx.roomType.findUnique({ where: { id: d.roomTypeId } });
      if (!rt || !rt.active) throw new Error("NOT_FOUND");
      if (d.guests > rt.capacity) throw new Error("CAPACITY");
      if ((await unitsLeft(tx, rt.id, checkIn, checkOut)) < 1) throw new Error("SOLD_OUT");
      return tx.booking.create({
        data: {
          reference: randomBytes(4).toString("hex").toUpperCase(),
          roomTypeId: rt.id, guestName: d.guestName, guestEmail: d.guestEmail, guestPhone: d.guestPhone,
          guests: d.guests, requests: d.requests, checkIn, checkOut, totalPrice: nights * rt.pricePerNight,
        },
      });
    });
    return NextResponse.json({ reference: booking.reference });
  } catch (e: any) {
    const msg: Record<string, string> = {
      SOLD_OUT: "Sorry, this room is no longer available for those dates.",
      CAPACITY: "Too many guests for this room.",
      NOT_FOUND: "Room not found.",
    };
    return NextResponse.json({ error: msg[e.message] ?? "Something went wrong." }, { status: e.message in msg ? 409 : 500 });
  }
}

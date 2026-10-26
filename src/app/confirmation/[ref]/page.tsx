import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { fmt, money, nightsBetween } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function Confirmation({ params }: { params: { ref: string } }) {
  const b = await prisma.booking.findUnique({ where: { reference: params.ref }, include: { roomType: true } });
  if (!b) notFound();
  return (
    <section className="confirmation">
      <h1>Reservation {b.status === "CANCELLED" ? "cancelled" : "confirmed"}</h1>
      <p>Your reference: <strong className="ref">{b.reference}</strong></p>
      <dl>
        <dt>Room</dt><dd>{b.roomType.name}</dd>
        <dt>Check-in</dt><dd>{fmt(b.checkIn)}</dd>
        <dt>Check-out</dt><dd>{fmt(b.checkOut)} ({nightsBetween(b.checkIn, b.checkOut)} nights)</dd>
        <dt>Guests</dt><dd>{b.guests}</dd>
        <dt>Name</dt><dd>{b.guestName}</dd>
        <dt>Total</dt><dd>{money(b.totalPrice)}</dd>
      </dl>
      <Link href="/" className="btn btn--ghost">Back to home</Link>
    </section>
  );
}

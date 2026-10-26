import { prisma } from "@/lib/db";
import { fmt } from "@/lib/dates";
import AdminPanel from "@/components/AdminPanel";

export const dynamic = "force-dynamic";

export default async function Admin() {
  const [rooms, bookings] = await Promise.all([
    prisma.roomType.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.booking.findMany({ orderBy: { createdAt: "desc" }, include: { roomType: true } }),
  ]);
  return (
    <AdminPanel
      rooms={rooms.map(({ id, name, pricePerNight, capacity, totalUnits, active }) => ({ id, name, pricePerNight, capacity, totalUnits, active }))}
      bookings={bookings.map((b) => ({ id: b.id, reference: b.reference, guestName: b.guestName, guestEmail: b.guestEmail, guestPhone: b.guestPhone, roomName: b.roomType.name, checkIn: fmt(b.checkIn), checkOut: fmt(b.checkOut), totalPrice: b.totalPrice, status: b.status }))}
    />
  );
}

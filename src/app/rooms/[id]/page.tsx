import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { money } from "@/lib/dates";
import BookingForm from "@/components/BookingForm";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ checkIn?: string; checkOut?: string; guests?: string }>;

export default async function RoomPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const [{ id }, search] = await Promise.all([params, searchParams]);
  const room = await prisma.roomType.findUnique({ where: { id } });
  if (!room || !room.active) notFound();
  return (
    <div className="room-detail">
      <div>
        <div className="gallery">
          {room.images.length ? room.images.map((src) => <img key={src} src={src} alt={room.name} />) : <div className="room-card__img room-card__img--empty" />}
        </div>
        <h1>{room.name}</h1>
        <p>{room.description}</p>
        <p className="muted">Sleeps {room.capacity}</p>
        <p className="price">{money(room.pricePerNight)} <span className="muted">/ night</span></p>
      </div>
      <aside>
        <h2>Reserve</h2>
        <BookingForm roomTypeId={room.id} price={room.pricePerNight} capacity={room.capacity}
          checkIn={search.checkIn ?? ""} checkOut={search.checkOut ?? ""} guests={search.guests ?? "2"} />
      </aside>
    </div>
  );
}

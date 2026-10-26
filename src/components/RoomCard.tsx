import Link from "next/link";
import { money } from "@/lib/dates";

type Room = { id: string; name: string; description: string; pricePerNight: number; capacity: number; images: string[]; unitsLeft?: number };

export default function RoomCard({ room, query = "" }: { room: Room; query?: string }) {
  return (
    <article className="room-card">
      {room.images[0] ? <img src={room.images[0]} alt={room.name} className="room-card__img" /> : <div className="room-card__img room-card__img--empty" />}
      <div className="room-card__body">
        <h3>{room.name}</h3>
        <p>{room.description}</p>
        <p className="muted">Sleeps {room.capacity}{room.unitsLeft !== undefined && ` · ${room.unitsLeft} left`}</p>
        <p className="price">{money(room.pricePerNight)} <span className="muted">/ night</span></p>
        <Link className="btn" href={`/rooms/${room.id}${query}`}>View and book</Link>
      </div>
    </article>
  );
}

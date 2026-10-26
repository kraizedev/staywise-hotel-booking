import { prisma } from "@/lib/db";
import { searchAvailable } from "@/lib/availability";
import { isValidDate, toDate } from "@/lib/dates";
import RoomCard from "@/components/RoomCard";
import SearchForm from "@/components/SearchForm";

export const dynamic = "force-dynamic";

export default async function Rooms({ searchParams }: { searchParams: { checkIn?: string; checkOut?: string; guests?: string } }) {
  const { checkIn, checkOut, guests = "2" } = searchParams;
  const searching = isValidDate(checkIn) && isValidDate(checkOut) && toDate(checkOut!) > toDate(checkIn!);
  const rooms = searching
    ? await searchAvailable(toDate(checkIn!), toDate(checkOut!), Number(guests))
    : await prisma.roomType.findMany({ where: { active: true }, orderBy: { pricePerNight: "asc" } });
  const query = searching ? `?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}` : "";

  return (
    <>
      <h1>Rooms</h1>
      <SearchForm checkIn={checkIn} checkOut={checkOut} guests={guests} />
      {searching && !rooms.length && <p className="empty">No rooms available for those dates. Try different dates or fewer guests.</p>}
      <div className="room-grid">{rooms.map((r) => <RoomCard key={r.id} room={r} query={query} />)}</div>
    </>
  );
}

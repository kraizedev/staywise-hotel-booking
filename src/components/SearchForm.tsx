import { todayStr } from "@/lib/dates";

export default function SearchForm({ checkIn = "", checkOut = "", guests = "2" }: { checkIn?: string; checkOut?: string; guests?: string }) {
  return (
    <form action="/rooms" method="get" className="search-form">
      <label>Check-in<input type="date" name="checkIn" min={todayStr()} defaultValue={checkIn} required /></label>
      <label>Check-out<input type="date" name="checkOut" min={todayStr()} defaultValue={checkOut} required /></label>
      <label>Guests<input type="number" name="guests" min={1} max={10} defaultValue={guests} required /></label>
      <button type="submit" className="btn">Search rooms</button>
    </form>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = { roomTypeId: string; price: number; capacity: number; checkIn: string; checkOut: string; guests: string };

export default function BookingForm({ roomTypeId, price, capacity, ...init }: Props) {
  const router = useRouter();
  const [f, setF] = useState({ checkIn: init.checkIn, checkOut: init.checkOut, guests: init.guests || "1", guestName: "", guestEmail: "", guestPhone: "", requests: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<any>) => setF({ ...f, [k]: e.target.value });

  const nights = f.checkIn && f.checkOut ? Math.round((+new Date(f.checkOut) - +new Date(f.checkIn)) / 86400000) : 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    const res = await fetch("/api/bookings", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...f, roomTypeId, guests: Number(f.guests), requests: f.requests || undefined }),
    });
    const data = await res.json();
    if (res.ok) router.push(`/confirmation/${data.reference}`);
    else { setError(data.error); setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="booking-form">
      <label>Check-in<input type="date" value={f.checkIn} onChange={set("checkIn")} required /></label>
      <label>Check-out<input type="date" value={f.checkOut} onChange={set("checkOut")} required /></label>
      <label>Guests<input type="number" min={1} max={capacity} value={f.guests} onChange={set("guests")} required /></label>
      <label>Full name<input value={f.guestName} onChange={set("guestName")} required /></label>
      <label>Email<input type="email" value={f.guestEmail} onChange={set("guestEmail")} required /></label>
      <label>Phone<input value={f.guestPhone} onChange={set("guestPhone")} required /></label>
      <label>Special requests<textarea value={f.requests} onChange={set("requests")} rows={3} /></label>
      {nights > 0 && <p className="total">{nights} night{nights > 1 && "s"} · Total {new Intl.NumberFormat("en").format(nights * price)}</p>}
      {error && <p className="error">{error}</p>}
      <button className="btn" disabled={busy || nights < 1}>{busy ? "Booking…" : "Confirm reservation"}</button>
    </form>
  );
}

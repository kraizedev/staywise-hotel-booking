"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Room = { id: string; name: string; pricePerNight: number; capacity: number; totalUnits: number; active: boolean };
type Booking = { id: string; reference: string; guestName: string; guestEmail: string; guestPhone: string; roomName: string; checkIn: string; checkOut: string; totalPrice: number; status: string };

export default function AdminPanel({ rooms, bookings }: { rooms: Room[]; bookings: Booking[] }) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function call(url: string, method: string, body?: unknown) {
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) setMsg(data.error || "Failed"); else { setMsg(""); router.refresh(); }
    return res.ok;
  }

  async function addRoom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const images: string[] = [];
    const file = fd.get("image") as File;
    if (file && file.size) {
      const up = await fetch("/api/admin/upload", { method: "POST", body: (() => { const x = new FormData(); x.set("file", file); return x; })() });
      if (up.ok) images.push((await up.json()).url); else setMsg("Image upload failed. Check Cloudinary settings.");
    }
    const ok = await call("/api/admin/rooms", "POST", {
      name: fd.get("name"), description: fd.get("description"), images,
      pricePerNight: Number(fd.get("pricePerNight")), capacity: Number(fd.get("capacity")), totalUnits: Number(fd.get("totalUnits")),
    });
    if (ok) form.reset();
    setBusy(false);
  }

  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); router.push("/admin/login"); }

  return (
    <div className="admin">
      <div className="admin__bar"><h1>Admin</h1><button className="btn btn--ghost" onClick={logout}>Log out</button></div>
      {msg && <p className="error">{msg}</p>}

      <section>
        <h2>Reservations</h2>
        <div className="table-wrap"><table>
          <thead><tr><th>Ref</th><th>Guest</th><th>Room</th><th>Dates</th><th>Total</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.reference}</td>
                <td>{b.guestName}<br /><span className="muted">{b.guestEmail} · {b.guestPhone}</span></td>
                <td>{b.roomName}</td><td>{b.checkIn} → {b.checkOut}</td><td>{b.totalPrice}</td><td>{b.status}</td>
                <td>{b.status !== "CANCELLED" && <button className="btn btn--ghost" onClick={() => confirm("Cancel this booking?") && call(`/api/admin/bookings/${b.id}`, "PATCH")}>Cancel</button>}</td>
              </tr>
            ))}
            {!bookings.length && <tr><td colSpan={7}>No reservations yet.</td></tr>}
          </tbody>
        </table></div>
      </section>

      <section>
        <h2>Rooms</h2>
        <div className="table-wrap"><table>
          <thead><tr><th>Name</th><th>Price</th><th>Sleeps</th><th>Units</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td><td>{r.pricePerNight}</td><td>{r.capacity}</td><td>{r.totalUnits}</td><td>{r.active ? "Active" : "Hidden"}</td>
                <td>
                  <button className="btn btn--ghost" onClick={() => { const p = prompt("New price per night", String(r.pricePerNight)); if (p) call(`/api/admin/rooms/${r.id}`, "PATCH", { pricePerNight: Number(p) }); }}>Edit price</button>{" "}
                  <button className="btn btn--ghost" onClick={() => call(`/api/admin/rooms/${r.id}`, "PATCH", { active: !r.active })}>{r.active ? "Hide" : "Show"}</button>{" "}
                  <button className="btn btn--ghost" onClick={() => confirm("Delete this room?") && call(`/api/admin/rooms/${r.id}`, "DELETE")}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>

        <h3>Add a room</h3>
        <form onSubmit={addRoom} className="admin-form">
          <label>Name<input name="name" required /></label>
          <label>Description<textarea name="description" rows={2} required /></label>
          <label>Price per night<input name="pricePerNight" type="number" min={0} required /></label>
          <label>Sleeps<input name="capacity" type="number" min={1} required /></label>
          <label>Number of rooms<input name="totalUnits" type="number" min={1} required /></label>
          <label>Photo<input name="image" type="file" accept="image/*" /></label>
          <button className="btn" disabled={busy}>{busy ? "Saving…" : "Add room"}</button>
        </form>
      </section>
    </div>
  );
}

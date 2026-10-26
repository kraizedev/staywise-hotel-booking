import { NextRequest, NextResponse } from "next/server";
import { searchAvailable } from "@/lib/availability";
import { isValidDate, toDate } from "@/lib/dates";

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const ci = p.get("checkIn"), co = p.get("checkOut");
  const guests = Number(p.get("guests") || 1);

  if (!isValidDate(ci) || !isValidDate(co) || toDate(co!) <= toDate(ci!))
    return NextResponse.json({ error: "Provide valid check-in and check-out dates." }, { status: 400 });
  if (!Number.isInteger(guests) || guests < 1 || guests > 20)
    return NextResponse.json({ error: "Guests must be a whole number between 1 and 20." }, { status: 400 });

  return NextResponse.json(await searchAvailable(toDate(ci!), toDate(co!), guests));
}

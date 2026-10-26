import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

export const roomSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
  pricePerNight: z.number().int().min(0),
  capacity: z.number().int().min(1),
  totalUnits: z.number().int().min(1),
  images: z.array(z.string().url()).default([]),
  active: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  const p = roomSchema.safeParse(await req.json());
  if (!p.success) return NextResponse.json({ error: "Invalid room data" }, { status: 400 });
  return NextResponse.json(await prisma.roomType.create({ data: p.data }));
}

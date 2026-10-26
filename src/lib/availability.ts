import { Prisma } from "@prisma/client";
import { prisma } from "./db";

type Db = Prisma.TransactionClient | typeof prisma;

/** Units of a room type still free for [checkIn, checkOut). Overlap rule: existing.in < req.out AND existing.out > req.in */
export async function unitsLeft(db: Db, roomTypeId: string, checkIn: Date, checkOut: Date) {
  const rt = await db.roomType.findUnique({ where: { id: roomTypeId } });
  if (!rt) return 0;
  const taken = await db.booking.count({
    where: { roomTypeId, status: { not: "CANCELLED" }, checkIn: { lt: checkOut }, checkOut: { gt: checkIn } },
  });
  return Math.max(0, rt.totalUnits - taken);
}

export async function searchAvailable(checkIn: Date, checkOut: Date, guests: number) {
  const types = await prisma.roomType.findMany({ where: { active: true, capacity: { gte: guests } }, orderBy: { pricePerNight: "asc" } });
  const withLeft = await Promise.all(types.map(async (t) => ({ ...t, unitsLeft: await unitsLeft(prisma, t.id, checkIn, checkOut) })));
  return withLeft.filter((t) => t.unitsLeft > 0);
}

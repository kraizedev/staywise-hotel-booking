import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) {
    throw new Error("Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters before seeding.");
  }

  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash: await bcrypt.hash(password, 12) },
    create: { email, passwordHash: await bcrypt.hash(password, 12) },
  });

  if ((await prisma.roomType.count()) === 0) {
    await prisma.roomType.createMany({
      data: [
        { name: "Standard Room", description: "Comfortable room with a queen bed, desk and private bath.", pricePerNight: 80, capacity: 2, totalUnits: 5, images: [] },
        { name: "Deluxe Room", description: "Spacious room with a king bed, sitting area and city view.", pricePerNight: 130, capacity: 3, totalUnits: 3, images: [] },
        { name: "Family Suite", description: "Two bedrooms, living area and kitchenette for up to 5 guests.", pricePerNight: 210, capacity: 5, totalUnits: 2, images: [] },
      ],
    });
  }
}

main()
  .catch((error) => {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());

import { z } from "zod";

export const roomSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(2).max(3000),
  pricePerNight: z.number().int().min(0).max(10000000),
  capacity: z.number().int().min(1).max(20),
  totalUnits: z.number().int().min(1).max(1000),
  images: z.array(z.string().url()).max(10).default([]),
  active: z.boolean().optional(),
});

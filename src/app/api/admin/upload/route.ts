import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const file = (await req.formData()).get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  const url = await uploadImage(Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url });
}

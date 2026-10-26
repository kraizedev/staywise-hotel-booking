import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function POST(req: NextRequest) {
  let form: FormData;
  try { form = await req.formData(); } catch {
    return NextResponse.json({ error: "Invalid upload form." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0)
    return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  if (!ALLOWED_TYPES.has(file.type))
    return NextResponse.json({ error: "Use a JPEG, PNG, WebP, or AVIF image." }, { status: 415 });
  if (file.size > MAX_BYTES)
    return NextResponse.json({ error: "Image must be 10 MB or smaller." }, { status: 413 });

  try {
    const url = await uploadImage(Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Image upload failed. Check Cloudinary configuration." }, { status: 502 });
  }
}

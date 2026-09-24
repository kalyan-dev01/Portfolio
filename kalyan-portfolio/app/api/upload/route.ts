import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

const BUCKET = "portfolio-assets";
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const ALLOWED_DOC_TYPES = ["application/pdf"];

// Handles every upload in the app (avatar, project thumbnail/screenshots,
// certificate images, resume). folder = "avatars" | "projects" | "certifications" | "resume".
export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "misc";

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const isDocFolder = folder === "resume";
  const allowed = isDocFolder ? ALLOWED_DOC_TYPES : ALLOWED_IMAGE_TYPES;

  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type || "unknown"}.` },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File is larger than the 5MB limit." }, { status: 400 });
  }

  const safeFolder = folder.replace(/[^a-z0-9-]/gi, "");
  const ext = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "") || "bin";
  const path = `${safeFolder}/${crypto.randomUUID()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error } = await supabaseServer.storage
    .from(BUCKET)
    .upload(path, arrayBuffer, { contentType: file.type, upsert: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabaseServer.storage.from(BUCKET).getPublicUrl(path);

  return NextResponse.json({ data: { url: publicUrlData.publicUrl, path, fileName: file.name } });
}

// DELETE ?path=folder/file.ext — removes a previously uploaded file.
export async function DELETE(req: Request) {
  const path = new URL(req.url).searchParams.get("path");
  if (!path) return NextResponse.json({ error: "path is required." }, { status: 400 });

  const { error } = await supabaseServer.storage.from(BUCKET).remove([path]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

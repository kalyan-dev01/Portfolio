import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getResume } from "@/lib/queries";

export async function GET() {
  return NextResponse.json({ data: await getResume() });
}

// Body: { file_url, file_name } — set both to null to remove the resume.
export async function PUT(req: Request) {
  const body = await req.json();
  const existing = await getResume();

  const payload = {
    file_url: body.file_url ?? null,
    file_name: body.file_name ?? null,
    updated_at: new Date().toISOString(),
  };

  const query = existing
    ? supabaseServer.from("resume").update(payload).eq("id", existing.id)
    : supabaseServer.from("resume").insert(payload);

  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: await getResume() });
}

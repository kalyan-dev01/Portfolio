import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/queries";

export async function GET() {
  return NextResponse.json({ data: await getSiteSettings() });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const existing = await getSiteSettings();

  const payload = {
    site_title: body.site_title,
    meta_description: body.meta_description,
    accent_color: body.accent_color ?? null,
    updated_at: new Date().toISOString(),
  };

  const query = existing
    ? supabaseServer.from("site_settings").update(payload).eq("id", existing.id)
    : supabaseServer.from("site_settings").insert(payload);

  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: await getSiteSettings() });
}

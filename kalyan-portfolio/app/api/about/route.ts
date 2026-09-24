import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getAbout } from "@/lib/queries";

export async function GET() {
  const about = await getAbout();
  return NextResponse.json({ data: about });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const existing = await getAbout();

  const payload = {
    name: body.name,
    title: body.title,
    location: body.location,
    email: body.email,
    phone: body.phone ?? null,
    avatar_url: body.avatar_url ?? null,
    hero_heading: body.hero_heading,
    hero_description: body.hero_description,
    about_text: body.about_text,
    career_goal: body.career_goal ?? null,
    updated_at: new Date().toISOString(),
  };

  if (!payload.name || !payload.title || !payload.email) {
    return NextResponse.json({ error: "Name, title and email are required." }, { status: 400 });
  }

  const query = existing
    ? supabaseServer.from("about").update(payload).eq("id", existing.id)
    : supabaseServer.from("about").insert(payload);

  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: await getAbout() });
}

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getSkills } from "@/lib/queries";

export async function GET(req: Request) {
  const admin = new URL(req.url).searchParams.get("admin") === "1";
  return NextResponse.json({ data: await getSkills(admin) });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.category || !body.name) {
    return NextResponse.json({ error: "Category and name are required." }, { status: 400 });
  }
  const { data, error } = await supabaseServer
    .from("skills")
    .insert({
      category: body.category,
      name: body.name,
      icon: body.icon ?? null,
      display_order: body.display_order ?? 0,
      visible: body.visible ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

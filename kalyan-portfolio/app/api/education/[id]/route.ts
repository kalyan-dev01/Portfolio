import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { data, error } = await supabaseServer
    .from("education")
    .update({
      degree: body.degree,
      field: body.field ?? null,
      institution: body.institution,
      location: body.location ?? null,
      start_date: body.start_date ?? null,
      end_date: body.end_date ?? null,
      cgpa: body.cgpa ?? null,
      description: body.description ?? null,
      display_order: body.display_order ?? 0,
    })
    .eq("id", params.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await supabaseServer.from("education").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

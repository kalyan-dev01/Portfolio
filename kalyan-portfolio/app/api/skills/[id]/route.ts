import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { data, error } = await supabaseServer
    .from("skills")
    .update({
      category: body.category,
      name: body.name,
      icon: body.icon ?? null,
      display_order: body.display_order,
      visible: body.visible,
    })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await supabaseServer.from("skills").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

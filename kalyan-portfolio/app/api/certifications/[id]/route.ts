import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { isSafeExternalUrl } from "@/lib/utils";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  if (!isSafeExternalUrl(body.credential_url)) {
    return NextResponse.json({ error: "Credential URL must be a valid http(s) link." }, { status: 400 });
  }
  const { data, error } = await supabaseServer
    .from("certifications")
    .update({
      name: body.name,
      issuer: body.issuer ?? null,
      date: body.date ?? null,
      credential_url: body.credential_url || null,
      image_url: body.image_url ?? null,
      display_order: body.display_order ?? 0,
    })
    .eq("id", params.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await supabaseServer.from("certifications").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

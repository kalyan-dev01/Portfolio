import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getCertifications } from "@/lib/queries";
import { isSafeExternalUrl } from "@/lib/utils";

export async function GET() {
  return NextResponse.json({ data: await getCertifications() });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!isSafeExternalUrl(body.credential_url)) {
    return NextResponse.json({ error: "Credential URL must be a valid http(s) link." }, { status: 400 });
  }
  const { data, error } = await supabaseServer
    .from("certifications")
    .insert({
      name: body.name,
      issuer: body.issuer ?? null,
      date: body.date ?? null,
      credential_url: body.credential_url || null,
      image_url: body.image_url ?? null,
      display_order: body.display_order ?? 0,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

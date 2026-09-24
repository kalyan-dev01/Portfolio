import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getEducation } from "@/lib/queries";

export async function GET() {
  return NextResponse.json({ data: await getEducation() });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.degree || !body.institution) {
    return NextResponse.json({ error: "Degree and institution are required." }, { status: 400 });
  }
  const { data, error } = await supabaseServer
    .from("education")
    .insert({
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
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

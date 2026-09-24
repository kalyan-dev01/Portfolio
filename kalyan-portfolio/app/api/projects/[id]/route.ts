import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getProjectById } from "@/lib/queries";
import { isSafeExternalUrl, slugify } from "@/lib/utils";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const data = await getProjectById(params.id);
  if (!data) return NextResponse.json({ error: "Project not found." }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();

  if (!body.name || !body.short_description) {
    return NextResponse.json({ error: "Name and short description are required." }, { status: 400 });
  }
  if (!isSafeExternalUrl(body.github_url) || !isSafeExternalUrl(body.live_url)) {
    return NextResponse.json({ error: "GitHub URL and Live URL must be valid http(s) links." }, { status: 400 });
  }

  const { error } = await supabaseServer
    .from("projects")
    .update({
      slug: body.slug ? slugify(body.slug) : slugify(body.name),
      name: body.name,
      short_description: body.short_description,
      detailed_description: body.detailed_description ?? null,
      thumbnail_url: body.thumbnail_url ?? null,
      technologies: body.technologies ?? [],
      features: body.features ?? [],
      github_url: body.github_url || null,
      live_url: body.live_url || null,
      featured: body.featured ?? false,
      published: body.published ?? false,
      display_order: body.display_order ?? 0,
      challenges: body.challenges ?? null,
      outcomes: body.outcomes ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (Array.isArray(body.images)) {
    await supabaseServer.from("project_images").delete().eq("project_id", params.id);
    if (body.images.length) {
      const rows = body.images.map((url: string, i: number) => ({
        project_id: params.id,
        image_url: url,
        display_order: i,
      }));
      await supabaseServer.from("project_images").insert(rows);
    }
  }

  return NextResponse.json({ data: await getProjectById(params.id) });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await supabaseServer.from("projects").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getProjects } from "@/lib/queries";
import { isSafeExternalUrl, slugify } from "@/lib/utils";

export async function GET(req: Request) {
  const admin = new URL(req.url).searchParams.get("admin") === "1";
  return NextResponse.json({ data: await getProjects(admin) });
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.name || !body.short_description) {
    return NextResponse.json({ error: "Name and short description are required." }, { status: 400 });
  }
  if (!isSafeExternalUrl(body.github_url) || !isSafeExternalUrl(body.live_url)) {
    return NextResponse.json({ error: "GitHub URL and Live URL must be valid http(s) links." }, { status: 400 });
  }

  const slug = body.slug ? slugify(body.slug) : slugify(body.name);

  const { data: project, error } = await supabaseServer
    .from("projects")
    .insert({
      slug,
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
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (Array.isArray(body.images) && body.images.length) {
    const rows = body.images.map((url: string, i: number) => ({
      project_id: project.id,
      image_url: url,
      display_order: i,
    }));
    await supabaseServer.from("project_images").insert(rows);
  }

  return NextResponse.json({ data: project });
}

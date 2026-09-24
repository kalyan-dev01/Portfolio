import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getSocialLinks } from "@/lib/queries";
import { isSafeExternalUrl } from "@/lib/utils";

export async function GET() {
  return NextResponse.json({ data: await getSocialLinks() });
}

// Bulk upsert — the admin social links editor saves the whole list at once.
export async function PUT(req: Request) {
  const body = await req.json();
  const links = body.links as Array<{
    id?: string;
    platform: string;
    label: string;
    url: string;
    display_order: number;
    visible: boolean;
  }>;

  for (const link of links) {
    if (!isSafeExternalUrl(link.url)) {
      return NextResponse.json({ error: `Invalid URL for ${link.label}` }, { status: 400 });
    }
  }

  const { error } = await supabaseServer.from("social_links").upsert(links);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: await getSocialLinks() });
}

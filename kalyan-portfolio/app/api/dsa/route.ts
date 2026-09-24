import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getDsaStats } from "@/lib/queries";
import { isSafeExternalUrl } from "@/lib/utils";

export async function GET() {
  return NextResponse.json({ data: await getDsaStats() });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const existing = await getDsaStats();

  if (!isSafeExternalUrl(body.leetcode_url)) {
    return NextResponse.json({ error: "LeetCode URL must be a valid http(s) link." }, { status: 400 });
  }

  const payload = {
    problems_solved: Number(body.problems_solved) || 0,
    leetcode_url: body.leetcode_url,
    description: body.description ?? null,
    updated_at: new Date().toISOString(),
  };

  const query = existing
    ? supabaseServer.from("dsa_stats").update(payload).eq("id", existing.id)
    : supabaseServer.from("dsa_stats").insert(payload);

  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: await getDsaStats() });
}

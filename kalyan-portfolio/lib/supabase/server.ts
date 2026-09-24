import { createClient } from "@supabase/supabase-js";

// Falls back to harmless placeholders when env vars aren't set yet, so
// `next build` / a fresh Vercel deploy never fails just because
// Supabase hasn't been connected yet. Every call site in lib/queries.ts
// catches request errors and returns empty data instead of throwing,
// so the public site simply shows a "not set up yet" message and the
// admin CMS shows empty states until real env vars are added.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Server-only client. Only ever imported from API routes / server
// components — never from a "use client" file. Prefers the
// service-role key (kept in an env var, never NEXT_PUBLIC_*) so admin
// API routes can bypass RLS for writes; falls back to the anon key so
// the app still runs (public reads only) before that key is set.
export const supabaseServer = createClient(supabaseUrl, serviceRoleKey || anonKey, {
  auth: { persistSession: false },
});

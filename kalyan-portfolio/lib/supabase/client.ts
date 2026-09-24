"use client";

import { createClient } from "@supabase/supabase-js";

// Falls back to harmless placeholders when env vars aren't set yet, so
// the app can be deployed to Vercel first and connected to Supabase
// afterwards without a build ever failing (see README "Deploy first,
// configure after").
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Browser client. Uses the public anon key only — safe to expose.
// Row Level Security policies (see supabase/setup.sql) restrict what
// this key can actually do: public read of published content, and
// writes only through the server-side API routes below, which use
// the service-role key that never reaches the browser.
export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey);

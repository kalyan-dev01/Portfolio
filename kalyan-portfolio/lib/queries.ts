import { supabaseServer } from "./supabase/server";
import type {
  AboutContent,
  Certification,
  DsaStats,
  Education,
  Project,
  ResumeInfo,
  SiteSettings,
  Skill,
  SocialLink,
} from "./types";

// Centralized, reusable data-access functions. API routes and server
// components both call through here rather than talking to Supabase
// directly, so query shape and error handling live in one place.
//
// Every function below swallows request errors (e.g. Supabase not
// configured yet, or a network hiccup) and returns empty data instead
// of throwing. That keeps `next build` and every page render safe to
// run before Supabase is connected — see README "Deploy first,
// configure after" — instead of crashing the whole app over missing
// content.

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function getAbout(): Promise<AboutContent | null> {
  return safe(async () => {
    const { data } = await supabaseServer.from("about").select("*").limit(1).maybeSingle();
    return data;
  }, null);
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  return safe(async () => {
    const { data } = await supabaseServer
      .from("social_links")
      .select("*")
      .order("display_order", { ascending: true });
    return data ?? [];
  }, []);
}

export async function getSkills(includeHidden = false): Promise<Skill[]> {
  return safe(async () => {
    let query = supabaseServer.from("skills").select("*").order("display_order", { ascending: true });
    if (!includeHidden) query = query.eq("visible", true);
    const { data } = await query;
    return data ?? [];
  }, []);
}

export async function getProjects(includeUnpublished = false): Promise<Project[]> {
  return safe(async () => {
    let query = supabaseServer
      .from("projects")
      .select("*, images:project_images(*)")
      .order("display_order", { ascending: true });
    if (!includeUnpublished) query = query.eq("published", true);
    const { data } = await query;
    return (data as Project[]) ?? [];
  }, []);
}

export async function getProjectById(id: string): Promise<Project | null> {
  return safe(async () => {
    const { data } = await supabaseServer
      .from("projects")
      .select("*, images:project_images(*)")
      .eq("id", id)
      .maybeSingle();
    return data as Project | null;
  }, null);
}

export async function getEducation(): Promise<Education[]> {
  return safe(async () => {
    const { data } = await supabaseServer
      .from("education")
      .select("*")
      .order("display_order", { ascending: true });
    return data ?? [];
  }, []);
}

export async function getCertifications(): Promise<Certification[]> {
  return safe(async () => {
    const { data } = await supabaseServer
      .from("certifications")
      .select("*")
      .order("display_order", { ascending: true });
    return data ?? [];
  }, []);
}

export async function getDsaStats(): Promise<DsaStats | null> {
  return safe(async () => {
    const { data } = await supabaseServer.from("dsa_stats").select("*").limit(1).maybeSingle();
    return data;
  }, null);
}

export async function getResume(): Promise<ResumeInfo | null> {
  return safe(async () => {
    const { data } = await supabaseServer.from("resume").select("*").limit(1).maybeSingle();
    return data;
  }, null);
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return safe(async () => {
    const { data } = await supabaseServer.from("site_settings").select("*").limit(1).maybeSingle();
    return data;
  }, null);
}

export async function getPortfolioData() {
  const [about, socialLinks, skills, projects, education, certifications, dsa, resume, settings] =
    await Promise.all([
      getAbout(),
      getSocialLinks(),
      getSkills(),
      getProjects(),
      getEducation(),
      getCertifications(),
      getDsaStats(),
      getResume(),
      getSiteSettings(),
    ]);
  return { about, socialLinks, skills, projects, education, certifications, dsa, resume, settings };
}

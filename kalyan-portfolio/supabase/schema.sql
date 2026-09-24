-- Kalyan Portfolio — Supabase schema
-- Run this in the Supabase SQL editor (or `supabase db push`) once per project.
-- Safe to re-run: every statement is guarded with IF NOT EXISTS / DROP ... IF EXISTS.

create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  site_title text not null default 'M Hemasatya Kalyan | Full-Stack Developer & AI/GenAI Developer',
  meta_description text not null default 'Full-stack and AI/GenAI developer portfolio of M Hemasatya Kalyan.',
  accent_color text,
  updated_at timestamptz not null default now()
);

create table if not exists about (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text not null,
  location text not null,
  email text not null,
  phone text,
  avatar_url text,
  hero_heading text not null,
  hero_description text not null,
  about_text text not null,
  career_goal text,
  updated_at timestamptz not null default now()
);

create table if not exists social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  label text not null,
  url text not null,
  display_order integer not null default 0,
  visible boolean not null default true
);

create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  icon text,
  display_order integer not null default 0,
  visible boolean not null default true
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text not null,
  detailed_description text,
  thumbnail_url text,
  technologies text[] not null default '{}',
  features text[] not null default '{}',
  github_url text,
  live_url text,
  featured boolean not null default false,
  published boolean not null default true,
  display_order integer not null default 0,
  challenges text,
  outcomes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  image_url text not null,
  display_order integer not null default 0
);

create table if not exists education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  field text,
  institution text not null,
  location text,
  start_date text,
  end_date text,
  cgpa text,
  description text,
  display_order integer not null default 0
);

create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  issuer text,
  date text,
  credential_url text,
  image_url text,
  display_order integer not null default 0
);

create table if not exists dsa_stats (
  id uuid primary key default gen_random_uuid(),
  problems_solved integer not null default 0,
  leetcode_url text not null,
  description text,
  updated_at timestamptz not null default now()
);

create table if not exists resume (
  id uuid primary key default gen_random_uuid(),
  file_url text,
  file_name text,
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_published on projects(published);
create index if not exists idx_projects_order on projects(display_order);
create index if not exists idx_skills_category on skills(category);
create index if not exists idx_project_images_project on project_images(project_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
-- The browser only ever holds the anon key, so RLS is what keeps the
-- public site read-only. All writes happen through Next.js API routes
-- using the service-role key (server-side only), which bypasses RLS.
-- There is no admin login in this first version (see README), so the
-- API routes themselves are the only write path — nothing in the
-- browser has permission to write directly to these tables.

alter table site_settings enable row level security;
alter table about enable row level security;
alter table social_links enable row level security;
alter table skills enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;
alter table education enable row level security;
alter table certifications enable row level security;
alter table dsa_stats enable row level security;
alter table resume enable row level security;

drop policy if exists "public read settings" on site_settings;
create policy "public read settings" on site_settings for select using (true);

drop policy if exists "public read about" on about;
create policy "public read about" on about for select using (true);

drop policy if exists "public read visible social links" on social_links;
create policy "public read visible social links" on social_links for select using (visible = true);

drop policy if exists "public read visible skills" on skills;
create policy "public read visible skills" on skills for select using (visible = true);

drop policy if exists "public read published projects" on projects;
create policy "public read published projects" on projects for select using (published = true);

drop policy if exists "public read project images" on project_images;
create policy "public read project images" on project_images for select using (
  exists (select 1 from projects p where p.id = project_images.project_id and p.published = true)
);

drop policy if exists "public read education" on education;
create policy "public read education" on education for select using (true);

drop policy if exists "public read certifications" on certifications;
create policy "public read certifications" on certifications for select using (true);

drop policy if exists "public read dsa" on dsa_stats;
create policy "public read dsa" on dsa_stats for select using (true);

drop policy if exists "public read resume" on resume;
create policy "public read resume" on resume for select using (true);

-- No insert/update/delete policies are defined for the anon role, so
-- those operations are denied by default under RLS. Only the
-- service-role key (used server-side in /app/api/**) can write.

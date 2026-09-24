-- ============================================================
-- Kalyan Portfolio — ONE-SHOT SETUP SCRIPT
-- ============================================================
-- Run this single file once in the Supabase SQL editor and your
-- database, storage bucket, and starting content are all ready.
-- It's the schema + storage bucket + seed data combined into one
-- script, in the right order. Safe to re-run any time — every
-- statement is guarded (IF NOT EXISTS / DROP ... IF EXISTS), except
-- the seed data block, which truncates and re-inserts the starting
-- content (so re-running it resets any edits back to the original
-- seed — only re-run that part intentionally).
-- ============================================================

-- ---------- 1. SCHEMA ----------

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
-- ---------- 2. STORAGE BUCKET ----------

insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

-- Public read for anyone (images/resume need to load on the public site).
drop policy if exists "public read portfolio assets" on storage.objects;
create policy "public read portfolio assets" on storage.objects
  for select using (bucket_id = 'portfolio-assets');

-- No insert/update/delete policy is granted to anon or authenticated
-- roles here. Uploads/replacements/deletes go through the
-- /api/upload route on the server, which uses the service-role key
-- and therefore bypasses these policies entirely. This keeps the
-- bucket write-protected even though there's no admin login yet.
-- ---------- 3. SEED DATA ----------
-- Safe to re-run, but re-running clears each table and re-inserts
-- the original content below (see note at the top of this file).

truncate table project_images, projects, skills, social_links, education,
  certifications, dsa_stats, resume, about, site_settings restart identity cascade;

insert into site_settings (site_title, meta_description) values (
  'M Hemasatya Kalyan | Full-Stack Developer & AI/GenAI Developer',
  'Full-stack and AI/GenAI developer portfolio of M Hemasatya Kalyan — React, Node.js, Python, LLMs and RAG.'
);

insert into about (
  name, title, location, email, phone, avatar_url,
  hero_heading, hero_description, about_text, career_goal
) values (
  'M Hemasatya Kalyan',
  'Full-Stack Developer & AI/GenAI Developer',
  'Hyderabad, India',
  'kalyancodes.dev@gmail.com',
  '+91 9381130142',
  null,
  E'Hi, I\'m Kalyan.',
  'I build modern web applications and AI-powered solutions using technologies such as React, Node.js, Python, LLMs, and RAG.',
  'I''m a B.Tech Computer Science and Engineering graduate focused on full-stack and AI/GenAI development. I build practical applications end to end — from REST APIs and React front ends to LLM-powered features and RAG systems — and I''m steadily building toward a career as a strong, capable software developer.',
  'Become a strong and capable software developer.'
);

insert into social_links (platform, label, url, display_order) values
  ('github', 'GitHub', 'https://github.com/kalyan-dev01', 1),
  ('linkedin', 'LinkedIn', 'https://www.linkedin.com/in/kalyan-m-7782ab375/', 2),
  ('leetcode', 'LeetCode', 'https://leetcode.com/u/bxTynzdW9r/', 3),
  ('email', 'Email', 'mailto:kalyancodes.dev@gmail.com', 4);

insert into skills (category, name, display_order) values
  ('Languages', 'JavaScript', 1),
  ('Languages', 'Python', 2),
  ('Frontend', 'React.js', 1),
  ('Frontend', 'HTML5', 2),
  ('Frontend', 'CSS3', 3),
  ('Frontend', 'Tailwind CSS', 4),
  ('Backend', 'Node.js', 1),
  ('Backend', 'Express.js', 2),
  ('Backend', 'REST APIs', 3),
  ('Backend', 'JWT Authentication', 4),
  ('AI / GenAI', 'LLM Integration', 1),
  ('AI / GenAI', 'Retrieval-Augmented Generation (RAG)', 2),
  ('AI / GenAI', 'Prompt Engineering', 3),
  ('AI / GenAI', 'Embeddings', 4),
  ('AI / GenAI', 'Semantic Retrieval', 5),
  ('AI / GenAI', 'Document Processing', 6),
  ('AI / GenAI', 'NLP Fundamentals', 7),
  ('Database', 'MongoDB', 1),
  ('Database', 'Mongoose', 2),
  ('Tools', 'Git', 1),
  ('Tools', 'GitHub', 2),
  ('Tools', 'VS Code', 3),
  ('Tools', 'Postman', 4);

insert into projects (
  slug, name, short_description, detailed_description, thumbnail_url,
  technologies, features, github_url, live_url, featured, published, display_order
) values (
  'mindmock-ai',
  'MindMock AI',
  'An AI-powered learning platform that generates quizzes from learning topics and study material.',
  'MindMock AI is an AI-powered learning platform that generates quizzes from learning topics and study material, aimed at making self-testing faster to set up and more focused on what a learner actually needs to review.',
  null,
  '{}',
  array[
    'AI-powered quiz generation',
    'Topic-based quiz generation',
    'Study material / PDF-based quiz generation',
    'Interactive learning experience'
  ],
  null,
  'https://mock-mind-ai-beta.vercel.app/',
  true, true, 1
), (
  'docubot-rag-service',
  'DocuBot RAG Service',
  'A Retrieval-Augmented Generation document question-answering system.',
  'DocuBot RAG Service is a Retrieval-Augmented Generation system for answering questions over documents: it processes and chunks documents, generates embeddings, retrieves the most relevant context for a query, and passes that context to an LLM to produce a grounded answer.',
  null,
  '{}',
  array[
    'Document processing and text extraction',
    'Text chunking',
    'Embeddings',
    'Semantic retrieval',
    'Retrieving relevant document context',
    'Passing retrieved context to an LLM',
    'Generating grounded answers'
  ],
  'https://github.com/kalyan-dev01/docubot-rag-service',
  null,
  true, true, 2
), (
  'book-metadata-web-scraper',
  'Book Metadata Web Scraper',
  'A Python-based web scraping project that collects structured book information from web pages.',
  'A Python-based web scraping project using Beautiful Soup and HTML parsing to collect structured information from web pages, converting raw page content into structured book data.',
  null,
  '{}',
  array[
    'Web scraping',
    'HTML parsing',
    'Structured data extraction',
    'Extracts book titles, authors, and metadata/content',
    'Converts web-page information into structured data'
  ],
  null,
  null,
  false, true, 3
);

insert into education (degree, field, institution, location, start_date, end_date, cgpa, display_order)
values (
  'Bachelor of Technology',
  'Computer Science and Engineering',
  'Malla Reddy College of Engineering & Technology',
  'Hyderabad',
  '2022-10',
  '2026-04',
  '7.55/10',
  1
);

insert into certifications (name, display_order) values
  ('Python for Everybody', 1),
  ('Full Stack Development Certification', 2);

insert into dsa_stats (problems_solved, leetcode_url, description) values (
  150,
  'https://leetcode.com/u/bxTynzdW9r/',
  'Regularly practicing Data Structures & Algorithms to strengthen problem-solving and programming fundamentals.'
);

insert into resume (file_url, file_name) values (null, null);

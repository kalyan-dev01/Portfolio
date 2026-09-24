# M Hemasatya Kalyan — Portfolio & CMS

A single-page developer portfolio with a lightweight admin CMS behind `/admin`. Built with
Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, and Supabase (Postgres + Storage).
No local database, no separate backend server — deploys straight to Vercel.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling, **Framer Motion** for animation
- **Supabase Postgres** for content, **Supabase Storage** for images/resume
- All writes go through Next.js API routes (`/app/api/**`) using the Supabase **service-role
  key**, which never reaches the browser. The public site only ever uses the anon key, and Row
  Level Security (RLS) restricts it to reading published/visible content.

## The fastest path: deploy first, connect Supabase after

The app is written so it never fails to build or deploy, even before Supabase is connected —
missing content just shows a friendly "not set up yet" message instead of an error. That means
you can do the whole thing in this order, with **no local setup required**:

1. **Push this folder to a new GitHub repo.**
2. **Import it in Vercel** ([vercel.com/new](https://vercel.com/new)) and click **Deploy**.
   It will build successfully right away — the public site will show a setup message, and
   `/admin` will show empty sections. That's expected at this point.
3. **Create a Supabase project** at [supabase.com](https://supabase.com) (free tier is enough).
   In **Project Settings → API**, copy the **Project URL**, **anon public key**, and
   **service_role key**.
4. Open Supabase's **SQL Editor**, paste in the entire contents of **`supabase/setup.sql`**,
   and run it once. This single script creates every table, the Row Level Security policies,
   the storage bucket, and seeds your real starting content (name, projects, skills, education,
   etc.) — nothing else to run.
5. Back in **Vercel → Project Settings → Environment Variables**, add the four variables from
   `.env.example` using the values from step 3 (plus your Vercel domain for
   `NEXT_PUBLIC_SITE_URL`).
6. **Redeploy** (Vercel → Deployments → ⋯ → Redeploy). The site and `/admin` are now fully live
   with your real content.

From here on, every edit you make in `/admin` is saved straight to Supabase — no more redeploys
needed for content changes, only if you change code or environment variables.

## Local setup (optional)

You don't need to run anything locally to deploy, but if you want to develop or preview
changes on your machine first:

```bash
npm install
cp .env.example .env.local
# fill in .env.local with your Supabase project's values from step 3 above
npm run dev
```

The site runs at `http://localhost:3000`, the admin CMS at `http://localhost:3000/admin`.

- `npm run build && npm run start` — production build, run locally.
- `npm run lint` — lint the project.

## Using the admin CMS

Visit `/admin` on your deployed site. From the sidebar you can edit:

- **About** — name, title, contact info, avatar, hero and about copy, career goal
- **Skills** — add/edit/delete, group by category, reorder, show/hide
- **Projects** — full CRUD, thumbnail + screenshot gallery uploads, technologies, features,
  optional GitHub/Live links, featured flag, draft/publish toggle, manual ordering, delete with
  confirmation
- **Education** — add/edit/delete entries
- **Certifications** — add/edit/delete, optional credential URL and certificate image
- **DSA / LeetCode** — problems-solved count and profile URL (powers the animated counter)
- **Resume** — upload/replace/remove a PDF
- **Contact** — the social/contact links shown across the site
- **Site Settings** — SEO title/description, and a one-click JSON export of all your content as
  a simple backup

### ⚠️ Important: `/admin` has no login (yet)

This first version ships **without authentication** on `/admin`, by design, to keep the initial
build simple. Anyone who knows the URL can edit your content. This is acceptable for a personal
project you're the only one visiting, but:

- **Do not link to `/admin` publicly** (it's already excluded from the navbar, sitemap, and
  `robots.txt`, but the URL itself isn't secret).
- If you want it locked down, the codebase is structured to make that easy to add later:
  - Add Supabase Auth (or any auth provider) and a `middleware.ts` that checks a session/cookie
    before allowing requests to `/admin/*` and to the write methods (`POST`/`PUT`/`DELETE`) on
    `/api/*`.
  - The GET-only read paths can stay public since they're already protected by RLS.
- Secrets are never exposed to the client: the service-role key is only read inside files under
  `/app/api/**`, none of which are `"use client"` files.

## Project structure

```
app/
  page.tsx              Public single-page portfolio
  layout.tsx             Root layout, fonts, SEO metadata, theme init script
  robots.ts / sitemap.ts Generated SEO files
  admin/                 /admin CMS (one route per content type)
  api/                    Server-side REST-style routes used by the CMS and by uploads
components/
  sections/               Public page sections (Navbar, Hero, About, Skills, Projects, ...)
  admin/                  Reusable admin UI (Sidebar, form fields, image uploader, ...)
  ui/                     Small shared UI primitives
lib/
  supabase/               Browser and server Supabase clients
  queries.ts              Centralized data-access functions
  types.ts                Shared TypeScript types
  utils.ts                Small helpers (URL validation, slugify, date formatting)
supabase/
  setup.sql                Run this one file — schema + storage bucket + seed content
  schema.sql               Same schema, kept standalone for reference
  seed.sql                 Same seed data, kept standalone for reference
  storage-setup.sql        Same storage setup, kept standalone for reference
```

## Notes on content accuracy

All seeded content comes directly from what was provided when this project was built — no
work experience, metrics, testimonials, or technologies were invented. Anything left blank
(such as a project's GitHub link) is intentionally empty and can be filled in through `/admin`
whenever it's available; the public site only renders links that are actually set.

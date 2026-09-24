-- Kalyan Portfolio — Storage bucket setup
-- Run in the Supabase SQL editor after schema.sql.
-- Creates one public bucket used for every upload type (avatar,
-- project thumbnails/screenshots, certificate images, resume).

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

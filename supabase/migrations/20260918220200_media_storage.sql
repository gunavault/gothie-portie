-- Uploads from the admin: work sketches, posters and voice lines.
-- Public bucket so the site can serve the files without signing URLs.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');

drop policy if exists "media authenticated insert" on storage.objects;
create policy "media authenticated insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "media authenticated update" on storage.objects;
create policy "media authenticated update" on storage.objects
  for update to authenticated using (bucket_id = 'media');

drop policy if exists "media authenticated delete" on storage.objects;
create policy "media authenticated delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media');

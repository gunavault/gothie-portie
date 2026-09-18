-- Portfolio content. One row per thing the admin can edit; the site reads these
-- and renders exactly what lib/content.ts used to hold.

create table sections (
  key text primary key,
  label text not null,
  num text not null,
  title text not null,
  body text not null,
  img text not null,
  pos text,
  layout text not null check (layout in ('about', 'work', 'hobby', 'movie', 'contact')),
  sort_order int not null
);

-- About: the Role / Base / Focus / Now rows
create table facts (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  sort_order int not null
);

-- Work: one row per classified work file
-- The list label ("Role — Org") and case number are derived from these by the
-- site, so the admin never has to keep a duplicate field in sync.
create table work_files (
  id uuid primary key default gen_random_uuid(),
  period text not null,
  role text not null,
  org text not null default '',
  image text not null,
  detail text not null default '',
  tags text[] not null default '{}',
  sort_order int not null
);

create table hobbies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  note text not null default '',
  sort_order int not null
);

create table movies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  kind text not null default '',
  quote text not null default '',
  poster text not null default '',
  voice text not null default '',
  sort_order int not null
);

create table channels (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  icon text not null check (icon in ('mail', 'in', 'ig', 'blog')),
  handle text not null,
  href text not null,
  hint text not null,
  sort_order int not null
);

-- Anyone may read the portfolio; only a signed-in user may change it.
do $$
declare t text;
begin
  foreach t in array array['sections', 'facts', 'work_files', 'hobbies', 'movies', 'channels'] loop
    execute format('alter table %I enable row level security', t);
    execute format(
      'create policy "public read" on %I for select to anon, authenticated using (true)', t);
    execute format(
      'create policy "authenticated write" on %I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

insert into sections (key, label, num, title, body, img, pos, layout, sort_order) values
  ('about', 'About Me', '01', 'About Me',
   'Cybersecurity engineer and software developer with 2+ years of hands-on experience delivering enterprise-grade solutions in high-stakes financial and security environments. Off the clock I design things, shoot photographs, and watch far too many films.',
   '/media/about.jpg', 'center 25%', 'about', 1),
  ('work', 'Work Experience', '02', 'Work Experience',
   'Where I have worked, most recent first. Click a role for details.',
   '/media/work.jpg', null, 'work', 2),
  ('hobby', 'Hobby', '03', 'Hobby',
   'What I do when the screen is off.',
   '/media/hobby.jpg', null, 'hobby', 3),
  ('movie', 'Movie', '04', 'My Favorite Movie',
   'The stories I keep coming back to — slow burns, big ideas, and a bit of science.',
   '/media/movie.jpg', 'center 30%', 'movie', 4),
  ('contact', 'Contact', '05', 'Contact',
   'Send a signal. I usually answer within a day.',
   '/media/contact.jpg', 'center 22%', 'contact', 5);

insert into facts (label, value, sort_order) values
  ('Role', 'Cybersecurity Engineer / Tech Nerd', 1),
  ('Base', 'Jakarta, ID', 2),
  ('Focus', 'Security · Software · Design', 3),
  ('Now', 'Open for collaboration', 4);

insert into work_files (period, role, org, image, detail, tags, sort_order) values
  ('2024 — Present', 'Cybersecurity Engineer', 'ALTO Network', '/media/work-detail.jpg',
   'Placeholder — describe your responsibilities: securing payment infrastructure, threat detection & response, vulnerability management, compliance (PCI-DSS).',
   array['Threat detection', 'Vulnerability mgmt', 'PCI-DSS', 'Incident response'], 1),
  ('2023 — 2024', 'Software Engineer Intern', 'PT Perkebunan Nusantara III', '/media/work-detail.jpg',
   'Placeholder — built internal tools, backend services and automation for plantation operations; stack and impact.',
   array['Backend', 'Internal tools', 'Automation'], 2),
  ('2022 — Present', 'Freelancer', 'Independent', '/media/work-detail.jpg',
   'Placeholder — web development, security audits and design work for clients; notable projects.',
   array['Web dev', 'Security audit', 'Design'], 3);

insert into hobbies (name, note, sort_order) values
  ('Fishing', 'Patience training, disguised as a weekend.', 1),
  ('Reading', 'Mostly non-fiction, security and sci-fi.', 2),
  ('Gaming', 'Story-driven, the slower the better.', 3),
  ('Watching movies', 'See section 04.', 4),
  ('Doing fun stuff', 'Anything that ends with a good story.', 5);

insert into movies (title, kind, quote, poster, voice, sort_order) values
  ('Peaky Blinders', 'Series · 2013', 'By order of the Peaky Blinders.',
   '/media/poster-peaky.jpg', '/media/voice-peaky.mp3', 1),
  ('Dune', 'Film · 2021', 'Fear is the mind-killer.',
   '/media/poster-dune.jpg', '/media/voice-dune.mp3', 2),
  ('Dr. Stone', 'Anime · 2019', 'Ten billion percent.',
   '/media/poster-drstone.jpg', '/media/voice-drstone.mp3', 3),
  ('Interstellar', 'Film · 2014', 'Do not go gentle into that good night.',
   '/media/poster-interstellar.jpg', '/media/voice-interstellar.mp3', 4);

insert into channels (label, icon, handle, href, hint, sort_order) values
  ('Mail', 'mail', 'gunadharma201@gmail.com', 'mailto:gunadharma201@gmail.com', 'Best for work', 1),
  ('LinkedIn', 'in', 'in/gunadharma0408', 'https://linkedin.com/in/gunadharma0408', 'Professional', 2),
  ('Instagram', 'ig', '@gunaaax', 'https://instagram.com/gunaaax', 'Photos & fun stuff', 3),
  ('Blog', 'blog', 'medium.com/@gunadharma201', 'https://medium.com/@gunadharma201', 'Writing on security & tech', 4);

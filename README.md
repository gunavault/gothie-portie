# Guna Dharma — Portfolio

A single-screen portfolio: a "HOLD ON" loader that draws itself while every image,
voice line and font downloads, then a glitch reveal into the hero, a crosshair cursor
with a camera-shutter click, and five full-screen section takeovers (About, Work,
Hobby, Movie, Contact). Every sound except the movie voice lines is synthesized in the
browser.

The loader's letterforms are Michroma outlines extracted to SVG paths
(`components/holdOn.ts`) and stroked on with anime.js `createDrawable`. Nothing is
shown until the last asset is in, with a 12-second ceiling so a stalled file cannot
trap a visitor on the loader.

Built with Next.js (App Router) + TypeScript, from the Claude Design prototype in
[`project/`](project/). The prototype and its chat transcripts are kept as the design
reference — see [`project/HANDOFF.md`](project/HANDOFF.md).

## Getting started

```bash
npm install
npm run dev
```

## Media

Everything the site needs is committed to `public/media/` — section images, movie
posters, voice lines and the two hero backgrounds:

| File | Used as |
| --- | --- |
| `hero-main.jpg` | the hero background (silhouette in spotlight) |
| `hero-glitch.jpg` | flickers through the intro's glitch slices (foggy street) |

Swapping either one is a drop-in replacement; if the new image crops badly, adjust its
`pos` in `lib/config.ts`. The hero stills are free-to-use Pexels photos ([30681569],
[29494279]). Fonts (Michroma, Space Mono) are self-hosted at build time by `next/font`,
so the site makes no third-party requests at runtime.

[30681569]: https://www.pexels.com/photo/30681569/
[29494279]: https://www.pexels.com/photo/29494279/

## Content and the admin

Content lives in Supabase and is edited at `/orbital-command`, behind Supabase Auth. The page
reads the database on the server and caches the result for five minutes; saving in the
admin revalidates it immediately, so there is no redeploy in the loop.

Until the environment variables are set the site serves the seed content committed in
`lib/content.ts`, and `/orbital-command` says what is missing rather than erroring. To set it up:

1. Create a Supabase project.
2. Apply `supabase/migrations/` — see below. On a fresh project you can also paste the
   files into the SQL editor in filename order.
3. Under **Authentication → Users**, add yourself with **Auto Confirm User** ticked.
   That is the only account that can sign in; there is no sign-up route.
4. Copy `.env.example` to `.env.local` for local work, and set the same two variables
   in Vercel's project settings. Both are the publishable values from **Settings → API**
   — the `service_role` key is not used anywhere and should not be added.
   `NEXT_PUBLIC_*` values are compiled in, so redeploy after adding them.

### Migrations

Pushing to `main` runs `.github/workflows/migrate.yml`, which replays every file in
`supabase/migrations/` against the database in filename order. It needs one repository
secret, **`SUPABASE_DB_URL`** (Settings → Secrets and variables → Actions):

Take it from Supabase under **Connect → Connection string → URI**, and use the
**session pooler** host (`aws-…pooler.supabase.com`). The direct `db.<ref>.supabase.co`
host is IPv6-only and GitHub's runners are IPv4, so it will hang. The string contains
your database password — it belongs in the secret, nowhere else.

Because the whole folder is replayed on every run, **each migration must be
re-runnable**: `create table if not exists`, `drop policy if exists` before `create
policy`, `create or replace function`, and seed inserts guarded by a row check so an
edit made in the admin is never overwritten.

The admin edits About, Work, Hobby and Movie. Work images, movie posters and voice
lines upload to the `media` bucket (images are downscaled in the browser first); the
Contact channels and the hero stills stay in the repo.

## Tuning

[`lib/config.ts`](lib/config.ts) holds the knobs that were tweakable in the design tool —
intro speed, skip intro, whether ambient sound starts on, which of the four section-open
sounds to use, and the click ring/flash. Copy lives in [`lib/content.ts`](lib/content.ts);
the three work-file descriptions are still the prototype's placeholder text.

## Layout

```
app/          layout, globals (keyframes + color tokens), page
components/   Portfolio (intro state machine, sound, cursor) + section views
lib/          config, content, Web Audio sound engine
public/media/ images and voice lines
project/      the original Claude Design prototype (assets stripped — see HANDOFF.md)
```

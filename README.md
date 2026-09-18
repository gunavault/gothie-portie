# Guna Dharma — Portfolio

A single-screen portfolio: black until everything loads, then a glitch reveal into the
hero, a crosshair cursor with a camera-shutter click, and five full-screen section
takeovers (About, Work, Hobby, Movie, Contact). Every sound except the movie voice
lines is synthesized in the browser.

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

Content lives in Supabase and is edited at `/admin`, behind Supabase Auth. The page
reads the database on the server and caches the result for five minutes; saving in the
admin revalidates it immediately, so there is no redeploy in the loop.

Until the environment variables are set the site serves the seed content committed in
`lib/content.ts`, and `/admin` says what is missing rather than erroring. To set it up:

1. Create a Supabase project.
2. Run the files in `supabase/migrations/` in order, in the SQL editor: the schema and
   seed content, the `save_portfolio` function, and the `media` storage bucket.
3. Under **Authentication → Users**, add yourself. That is the only account that can
   sign in; there is no sign-up route.
4. Copy `.env.example` to `.env.local` for local work, and set the same two variables
   in Vercel's project settings. Both are the publishable values from **Settings → API**
   — the `service_role` key is not used anywhere and should not be added.

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

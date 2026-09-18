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

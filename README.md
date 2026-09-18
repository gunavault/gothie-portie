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
npm run fetch:media   # downloads the two hero stills (see below)
npm run dev
```

## Media

Everything the site needs lives in `public/media/`. The two hero backgrounds are
free-to-use Pexels photos pulled in by `npm run fetch:media`, which also runs
automatically before `npm run build`; drop your own files at those paths to override
them, and they will be committed like the rest of the media:

| File | Used as |
| --- | --- |
| `hero-main.jpg` | the hero background (silhouette in spotlight) |
| `hero-glitch.jpg` | flickers through the intro's glitch slices (foggy street) |

Without them the hero renders black; nothing else is affected. Fonts (Michroma, Space
Mono) are self-hosted at build time by `next/font`, so the site makes no third-party
requests at runtime.

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

// Downloads the two hero stills into public/media. They are the only assets not
// committed to the repo: both are free-to-use Pexels photos, kept out of git.
import { createWriteStream } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "media");

const files = [
  {
    name: "hero-main.jpg",
    url: "https://images.pexels.com/photos/30681569/pexels-photo-30681569.jpeg?auto=compress&w=1920",
    credit: "Silhouette in spotlight — Pexels 30681569",
  },
  {
    name: "hero-glitch.jpg",
    url: "https://images.pexels.com/photos/29494279/pexels-photo-29494279.jpeg?auto=compress&w=1920",
    credit: "Foggy street — Pexels 29494279",
  },
];

await mkdir(outDir, { recursive: true });

for (const file of files) {
  const dest = join(outDir, file.name);
  const existing = await stat(dest).catch(() => null);
  if (existing && existing.size > 0) {
    console.log(`skip  ${file.name} (already present)`);
    continue;
  }
  // a missing hero still leaves the hero black; never worth failing a build over
  const res = await fetch(file.url).catch((error) => ({ ok: false, status: error.message }));
  if (!res.ok || !("body" in res) || !res.body) {
    console.warn(`warn  ${file.name} — could not fetch (${res.status}) — ${file.credit}`);
    continue;
  }
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  console.log(`ok    ${file.name} — ${file.credit}`);
}

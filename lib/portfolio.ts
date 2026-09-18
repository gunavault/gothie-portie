import { unstable_cache } from "next/cache";
import { sections as seed, type Section } from "./content";
import { readClient, supabaseConfigured } from "./supabase";

/** Revalidated from the admin whenever content is saved. */
export const PORTFOLIO_TAG = "portfolio";

type SectionRow = {
  key: string;
  label: string;
  num: string;
  title: string;
  body: string;
  img: string;
  pos: string | null;
  layout: Section["layout"];
};

/** "01", "02", … — the index labels the design derives from list position. */
const marker = (index: number) => String(index + 1).padStart(2, "0");

async function load(): Promise<Section[]> {
  if (!supabaseConfigured) return seed;

  const db = readClient();
  const [rows, facts, work, hobbies, movies, channels] = await Promise.all([
    db.from("sections").select("*").order("sort_order"),
    db.from("facts").select("*").order("sort_order"),
    db.from("work_files").select("*").order("sort_order"),
    db.from("hobbies").select("*").order("sort_order"),
    db.from("movies").select("*").order("sort_order"),
    db.from("channels").select("*").order("sort_order"),
  ]);

  const failed = [rows, facts, work, hobbies, movies, channels].find((r) => r.error);
  if (failed?.error || !rows.data?.length) {
    console.error("portfolio: falling back to seed content", failed?.error);
    return seed;
  }

  const items = (row: SectionRow): Section["items"] => {
    switch (row.layout) {
      case "about":
        return (facts.data ?? []).map((f) => ({ k: f.label, v: f.value }));
      case "work":
        return (work.data ?? []).map((w, i) => ({
          k: w.period,
          v: w.org ? `${w.role} — ${w.org}` : w.role,
          role: w.role,
          org: w.org,
          period: w.period,
          file: `CASE ${marker(i)}`,
          img: w.image,
          detail: w.detail,
          tags: w.tags,
        }));
      case "hobby":
        return (hobbies.data ?? []).map((h, i) => ({
          k: marker(i),
          v: h.name,
          note: h.note,
        }));
      case "movie":
        return (movies.data ?? []).map((m, i) => ({
          k: marker(i),
          v: m.title,
          type: m.kind,
          note: m.quote,
          poster: m.poster,
          voice: m.voice,
        }));
      case "contact":
        return (channels.data ?? []).map((c) => ({
          k: c.label,
          icon: c.icon,
          v: c.handle,
          href: c.href,
          hint: c.hint,
        }));
    }
  };

  return (rows.data as SectionRow[]).map(
    (row) =>
      ({
        key: row.key,
        label: row.label,
        num: row.num,
        title: row.title,
        body: row.body,
        img: row.img,
        pos: row.pos ?? undefined,
        layout: row.layout,
        items: items(row),
      }) as Section,
  );
}

export const getSections = unstable_cache(load, ["portfolio"], {
  tags: [PORTFOLIO_TAG],
  revalidate: 300,
});

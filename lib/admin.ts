import { sections as seed } from "./content";
import { serverClient } from "./supabase-server";

export type AdminContent = {
  aboutBody: string;
  facts: { label: string; value: string }[];
  work: {
    period: string;
    role: string;
    org: string;
    image: string;
    detail: string;
    tags: string[];
  }[];
  hobbies: { name: string; note: string }[];
  movies: { title: string; kind: string; quote: string; poster: string; voice: string }[];
};

/** What "Reset to defaults" restores: the content the site shipped with. */
export function seedContent(): AdminContent {
  const about = seed.find((s) => s.layout === "about");
  const work = seed.find((s) => s.layout === "work");
  const hobby = seed.find((s) => s.layout === "hobby");
  const movie = seed.find((s) => s.layout === "movie");

  return {
    aboutBody: about?.body ?? "",
    facts:
      about?.layout === "about"
        ? about.items.map((f) => ({ label: f.k, value: f.v }))
        : [],
    work:
      work?.layout === "work"
        ? work.items.map((w) => ({
            period: w.period,
            role: w.role,
            org: w.org,
            image: w.img,
            detail: w.detail,
            tags: w.tags,
          }))
        : [],
    hobbies:
      hobby?.layout === "hobby"
        ? hobby.items.map((h) => ({ name: h.v, note: h.note }))
        : [],
    movies:
      movie?.layout === "movie"
        ? movie.items.map((m) => ({
            title: m.v,
            kind: m.type,
            quote: m.note,
            poster: m.poster,
            voice: m.voice,
          }))
        : [],
  };
}

export async function getAdminContent(): Promise<AdminContent> {
  const db = await serverClient();
  const [about, facts, work, hobbies, movies] = await Promise.all([
    db.from("sections").select("body").eq("key", "about").single(),
    db.from("facts").select("*").order("sort_order"),
    db.from("work_files").select("*").order("sort_order"),
    db.from("hobbies").select("*").order("sort_order"),
    db.from("movies").select("*").order("sort_order"),
  ]);

  return {
    aboutBody: about.data?.body ?? "",
    facts: (facts.data ?? []).map((f) => ({ label: f.label, value: f.value })),
    work: (work.data ?? []).map((w) => ({
      period: w.period,
      role: w.role,
      org: w.org,
      image: w.image,
      detail: w.detail,
      tags: w.tags ?? [],
    })),
    hobbies: (hobbies.data ?? []).map((h) => ({ name: h.name, note: h.note })),
    movies: (movies.data ?? []).map((m) => ({
      title: m.title,
      kind: m.kind,
      quote: m.quote,
      poster: m.poster,
      voice: m.voice,
    })),
  };
}

"use client";

import { useEffect, useRef, useState } from "react";
import { resetContent, saveContent, signOut } from "@/app/admin/actions";
import type { AdminContent } from "@/lib/admin";
import AboutTab from "./AboutTab";
import WorkTab from "./WorkTab";
import HobbyTab from "./HobbyTab";
import MovieTab from "./MovieTab";
import s from "./admin.module.css";

type TabKey = "about" | "work" | "hobby" | "movie";

const tabs: { key: TabKey; label: string; hint: string }[] = [
  { key: "about", label: "About Me", hint: "Bio & fact rows" },
  { key: "work", label: "Work Experience", hint: "Roles → case files. Drag to reorder." },
  { key: "hobby", label: "Hobby", hint: "Stars in the constellation" },
  { key: "movie", label: "Movie", hint: "Posters, quotes & voice lines" },
];

export default function AdminApp({
  initial,
  email,
}: {
  initial: AdminContent;
  email: string;
}) {
  const [content, setContent] = useState(initial);
  const [tab, setTab] = useState<TabKey>("about");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [previewOn, setPreviewOn] = useState(false);
  const preview = useRef<HTMLIFrameElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => setPreviewOn(window.innerWidth >= 1280), []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const flash = (message: string) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  };

  const edit = (change: (draft: AdminContent) => void) => {
    setContent((current) => {
      const draft = structuredClone(current);
      change(draft);
      return draft;
    });
    setDirty(true);
  };

  const reloadPreview = () => {
    const frame = preview.current;
    if (frame) frame.src = frame.src;
  };

  const save = async () => {
    setSaving(true);
    const { error } = await saveContent(content);
    setSaving(false);
    if (error) {
      // the database's own message — "function does not exist", an RLS denial —
      // is the only thing that tells you what to fix
      flash(`Save failed — ${error}`);
      return;
    }
    setDirty(false);
    flash("Saved — portfolio updated");
    reloadPreview();
  };

  const reset = async () => {
    if (!confirm("Reset all content to the built-in defaults?")) return;
    const result = await resetContent();
    if (result.error || !("content" in result)) {
      flash(`Reset failed — ${result.error ?? "no content returned"}`);
      return;
    }
    setContent(result.content);
    setDirty(false);
    flash("Reset to defaults");
    reloadPreview();
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "portfolio-data.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const counts: Record<TabKey, number> = {
    about: content.facts.length,
    work: content.work.length,
    hobby: content.hobbies.length,
    movie: content.movies.length,
  };
  const current = tabs.find((t) => t.key === tab)!;

  return (
    <div className={previewOn ? s.shellPreview : s.shell}>
      <aside className={s.sidebar}>
        <div className={s.logo}>
          GD<span className={s.dot}>.</span>26 <span className={s.logoTag}>ADMIN</span>
        </div>

        <nav className={s.nav}>
          {tabs.map((item, i) => (
            <button
              key={item.key}
              type="button"
              className={item.key === tab ? s.tabOn : s.tab}
              onClick={() => setTab(item.key)}
            >
              <span className={s.tabNum}>{String(i + 1).padStart(2, "0")}</span>
              <span>{item.label}</span>
              <span className={s.tabCount}>{counts[item.key]}</span>
            </button>
          ))}
        </nav>

        <div className={s.tools}>
          <div className={s.store}>
            <span className={s.storeDot} />
            {email || "Signed in"}
          </div>
          <button type="button" className={s.toolButton} onClick={exportJson}>
            Export JSON
          </button>
          <button type="button" className={s.toolButton} onClick={reset}>
            Reset to defaults
          </button>
          <button type="button" className={s.lock} onClick={() => signOut()}>
            Lock ↩
          </button>
        </div>
      </aside>

      <main className={s.main}>
        <header className={s.header}>
          <div className={s.headings}>
            <div className={s.tabTitle}>{current.label}</div>
            <div className={s.tabHint}>{current.hint}</div>
          </div>
          <div className={s.actions}>
            {dirty && (
              <span className={s.unsaved}>
                <span className={s.unsavedDot} />
                Unsaved
              </span>
            )}
            <button
              type="button"
              className={s.ghost}
              onClick={() => setPreviewOn((on) => !on)}
            >
              {previewOn ? "Hide preview" : "Show preview"}
            </button>
            <button
              type="button"
              className={dirty ? s.save : s.saveIdle}
              onClick={save}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </header>

        <div className={s.body}>
          {tab === "about" && <AboutTab content={content} edit={edit} />}
          {tab === "work" && <WorkTab content={content} edit={edit} />}
          {tab === "hobby" && <HobbyTab content={content} edit={edit} />}
          {tab === "movie" && <MovieTab content={content} edit={edit} />}
        </div>
      </main>

      {previewOn && (
        <aside className={s.preview}>
          <div className={s.previewBar}>
            <span>Live preview — reloads on save</span>
            <div className={s.previewActions}>
              <button type="button" className={s.ghostSmall} onClick={reloadPreview}>
                Reload
              </button>
              <a
                className={s.ghostSmall}
                href="/"
                target="_blank"
                rel="noreferrer"
              >
                Open ↗
              </a>
            </div>
          </div>
          <iframe ref={preview} className={s.frame} src="/" title="Portfolio preview" />
        </aside>
      )}

      {toast && <div className={s.toast}>{toast}</div>}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import type { AdminContent } from "@/lib/admin";
import { move, useDragList } from "./useDragList";
import { uploadAudio, uploadImage } from "./upload";
import s from "./admin.module.css";

type Props = {
  content: AdminContent;
  edit: (change: (draft: AdminContent) => void) => void;
};

export default function MovieTab({ content, edit }: Props) {
  const { dragging, dragProps } = useDragList((from, to) =>
    edit((d) => move(d.movies, from, to)),
  );
  const audio = useRef<HTMLAudioElement | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [failed, setFailed] = useState("");

  const replacePoster = async (index: number, file: File | undefined) => {
    if (!file) return;
    setBusy(`poster-${index}`);
    setFailed("");
    const result = await uploadImage(file, 900);
    setBusy(null);
    if ("error" in result) return setFailed(result.error);
    edit((d) => void (d.movies[index].poster = result.url));
  };

  const replaceVoice = async (index: number, file: File | undefined) => {
    if (!file) return;
    setBusy(`voice-${index}`);
    setFailed("");
    const result = await uploadAudio(file);
    setBusy(null);
    if ("error" in result) return setFailed(result.error);
    edit((d) => void (d.movies[index].voice = result.url));
  };

  const voiceLabel = (voice: string) =>
    voice ? (voice.split("/").pop() ?? "Voice line") : "Upload voice line";

  const play = (src: string) => {
    audio.current?.pause();
    if (!src) return;
    audio.current = new Audio(src);
    void audio.current.play().catch(() => {});
  };

  return (
    <div className={s.movieGrid}>
      {failed && <div className={s.uploadErrorWide}>{failed}</div>}

      {content.movies.map((movie, i) => (
        <div
          key={i}
          className={dragging === i ? s.posterCardDragging : s.posterCard}
          {...dragProps(i)}
        >
          <label className={s.poster}>
            {movie.poster && (
              <div
                className={s.posterImage}
                style={{ backgroundImage: `url("${movie.poster}")` }}
              />
            )}
            <div className={s.posterShade} />
            <div className={s.posterNum}>{String(i + 1).padStart(2, "0")}</div>
            <div className={s.replaceOverlay}>
              {busy === `poster-${i}` ? "Uploading…" : "Replace poster"}
            </div>
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => replacePoster(i, e.target.files?.[0])}
            />
          </label>

          <div className={s.posterBody}>
            <input
              value={movie.title}
              placeholder="Title"
              onChange={(e) => edit((d) => void (d.movies[i].title = e.target.value))}
            />
            <input
              value={movie.kind}
              placeholder="Film · 2014"
              onChange={(e) => edit((d) => void (d.movies[i].kind = e.target.value))}
            />
            <input
              value={movie.quote}
              placeholder="Signature quote"
              onChange={(e) => edit((d) => void (d.movies[i].quote = e.target.value))}
            />
            <div className={s.voiceRow}>
              <label className={s.voicePick}>
                {busy === `voice-${i}` ? "Uploading…" : voiceLabel(movie.voice)}
                <input
                  type="file"
                  accept="audio/*"
                  hidden
                  onChange={(e) => replaceVoice(i, e.target.files?.[0])}
                />
              </label>
              <button
                type="button"
                title="Play line"
                className={s.play}
                onClick={() => play(movie.voice)}
              >
                ▶
              </button>
            </div>
            <div className={s.rowButtonsEnd}>
              <button
                type="button"
                className={s.iconButton}
                onClick={() => edit((d) => move(d.movies, i, i - 1))}
              >
                ↑
              </button>
              <button
                type="button"
                className={s.iconButton}
                onClick={() => edit((d) => move(d.movies, i, i + 1))}
              >
                ↓
              </button>
              <button
                type="button"
                className={s.removeButton}
                onClick={() =>
                  confirm("Remove this item?") && edit((d) => void d.movies.splice(i, 1))
                }
              >
                ×
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className={s.addCard}
        onClick={() =>
          edit(
            (d) =>
              void d.movies.push({
                title: "",
                kind: "",
                quote: "",
                poster: "",
                voice: "",
              }),
          )
        }
      >
        + Add title
      </button>
    </div>
  );
}

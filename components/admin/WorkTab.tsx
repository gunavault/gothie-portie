"use client";

import { useState } from "react";
import type { AdminContent } from "@/lib/admin";
import { move, useDragList } from "./useDragList";
import { uploadImage } from "./upload";
import s from "./admin.module.css";

type Props = {
  content: AdminContent;
  edit: (change: (draft: AdminContent) => void) => void;
};

export default function WorkTab({ content, edit }: Props) {
  const { dragging, dragProps } = useDragList((from, to) =>
    edit((d) => move(d.work, from, to)),
  );
  const [busy, setBusy] = useState<number | null>(null);
  const [failed, setFailed] = useState("");

  const replaceImage = async (index: number, file: File | undefined) => {
    if (!file) return;
    setBusy(index);
    setFailed("");
    const result = await uploadImage(file, 1400);
    setBusy(null);
    if ("error" in result) {
      setFailed(result.error);
      return;
    }
    edit((d) => void (d.work[index].image = result.url));
  };

  return (
    <div className={s.paneWide}>
      {failed && <div className={s.uploadError}>{failed}</div>}

      {content.work.map((role, i) => (
        <div
          key={i}
          className={dragging === i ? s.cardDragging : s.card}
          {...dragProps(i)}
        >
          <div className={s.cardHead}>
            <div className={s.cardTitle}>
              <span className={s.grip}>⋮⋮</span>
              <span className={s.case}>CASE {String(i + 1).padStart(2, "0")}</span>
              <span>{role.role}</span>
            </div>
            <div className={s.rowButtons}>
              <button
                type="button"
                className={s.iconButton}
                onClick={() => edit((d) => move(d.work, i, i - 1))}
              >
                ↑
              </button>
              <button
                type="button"
                className={s.iconButton}
                onClick={() => edit((d) => move(d.work, i, i + 1))}
              >
                ↓
              </button>
              <button
                type="button"
                className={s.removeButton}
                onClick={() =>
                  confirm("Remove this item?") && edit((d) => void d.work.splice(i, 1))
                }
              >
                ×
              </button>
            </div>
          </div>

          <div className={s.cardBody}>
            <label className={s.field}>
              <div className={s.thumb}>
                {role.image && (
                  <div
                    className={s.thumbImage}
                    style={{ backgroundImage: `url("${role.image}")` }}
                  />
                )}
              </div>
              <span className={s.replace}>
                {busy === i ? "Uploading…" : "Replace image"}
              </span>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => replaceImage(i, e.target.files?.[0])}
              />
            </label>

            <div className={s.fieldGrid}>
              <input
                value={role.role}
                placeholder="Role"
                onChange={(e) => edit((d) => void (d.work[i].role = e.target.value))}
              />
              <input
                value={role.org}
                placeholder="Company"
                onChange={(e) => edit((d) => void (d.work[i].org = e.target.value))}
              />
              <input
                value={role.period}
                placeholder="2024 — Present"
                onChange={(e) => edit((d) => void (d.work[i].period = e.target.value))}
              />
              <input
                value={role.tags.join(", ")}
                placeholder="Tags, comma separated"
                onChange={(e) =>
                  edit(
                    (d) =>
                      void (d.work[i].tags = e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean)),
                  )
                }
              />
              <textarea
                className={s.wide}
                value={role.detail}
                placeholder="What you did, stack, impact"
                onChange={(e) => edit((d) => void (d.work[i].detail = e.target.value))}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className={s.add}
        onClick={() =>
          edit((d) =>
            void d.work.push({
              period: "",
              role: "New role",
              org: "",
              image: "/media/work-detail.jpg",
              detail: "",
              tags: [],
            }),
          )
        }
      >
        + Add role
      </button>
    </div>
  );
}

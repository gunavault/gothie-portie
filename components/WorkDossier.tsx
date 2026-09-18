"use client";

import type { WorkFile } from "@/lib/content";
import { useUi } from "./ui";
import s from "./modal.module.css";

export default function WorkDossier({
  item,
  onClose,
}: {
  item: WorkFile;
  onClose: () => void;
}) {
  const { hover } = useUi();

  return (
    <div className={s.backdrop} onClick={onClose}>
      <div className={s.dossier} onClick={(event) => event.stopPropagation()}>
        <div className={s.sketch}>
          <div className={s.sketchImage} style={{ backgroundImage: `url("${item.img}")` }} />
          <div className={s.sketchShade} />
          <div className={s.sketchLines} />
          <div className={s.bracketTl} />
          <div className={s.bracketBr} />
          <div className={s.stamp}>
            {item.file} — {item.period}
          </div>
        </div>

        <div className={s.file}>
          <div className={s.fileHead}>
            <span className={s.classified}>
              <span className={s.beacon} />
              Classified — Work file
            </span>
            <button type="button" className={s.close} onClick={onClose} {...hover}>
              Close — Esc
            </button>
          </div>

          <div>
            <div className={s.role}>{item.role}</div>
            <div className={s.org}>{item.org}</div>
          </div>

          <div className={s.detail}>{item.detail}</div>

          <div className={s.tags}>
            {item.tags.map((tag) => (
              <span key={tag} className={s.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

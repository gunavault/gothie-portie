"use client";

import type { Section } from "@/lib/content";
import { SectionFooter, SectionHeader } from "../SectionChrome";
import { useUi } from "../ui";
import s from "./movie.module.css";

type Props = {
  section: Section & { layout: "movie" };
  onClose: () => void;
  onStep: (direction: number) => void;
  onShowPoster: (index: number, voice: string) => void;
};

export default function Movie({ section, onClose, onStep, onShowPoster }: Props) {
  const { hover } = useUi();

  return (
    <div className={s.stage}>
      <div className={s.backdrop} style={{ backgroundImage: `url("${section.img}")` }} />
      <div className={s.dim} />
      <div className={s.barTop} />
      <div className={s.barBottom} />

      <SectionHeader section={section} onClose={onClose} raised />

      <div className={s.layout}>
        <div className={s.intro}>
          <div className={s.eyebrow}>
            <span className={s.rule} />
            Now showing
          </div>
          <div className={s.title}>{section.title}</div>
          <div className={s.body}>{section.body}</div>
        </div>

        <div className={s.strip}>
          <div className={s.sprockets} />
          <div className={s.frames}>
            {section.items.map((item, index) => (
              <button
                key={item.k}
                type="button"
                className={s.frame}
                onClick={() => onShowPoster(index, item.voice)}
                {...hover}
              >
                <div
                  className={s.poster}
                  style={{ backgroundImage: `url("${item.poster}")` }}
                />
                <div className={s.shade} />
                <div className={s.meta}>
                  <span className={s.index}>{item.k}</span>
                  <span className={s.type}>{item.type}</span>
                </div>
                <div className={s.quote}>“{item.note}”</div>
                <div className={s.name}>{item.v}</div>
              </button>
            ))}
          </div>
          <div className={s.sprockets} />
        </div>
      </div>

      <SectionFooter section={section} onStep={onStep} raised />
    </div>
  );
}

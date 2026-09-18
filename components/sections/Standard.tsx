"use client";

import type { Section } from "@/lib/content";
import { SectionFooter, SectionHeader } from "../SectionChrome";
import { useUi } from "../ui";
import s from "../section.module.css";

type Props = {
  section: Section & { layout: "about" | "work" };
  onClose: () => void;
  onStep: (direction: number) => void;
  onExpand: (index: number) => void;
};

export default function Standard({ section, onClose, onStep, onExpand }: Props) {
  const { hover } = useUi();

  return (
    <div className={s.split}>
      <div className={s.image}>
        <div
          className={s.photo}
          style={{
            backgroundImage: `url("${section.img}")`,
            backgroundPosition: section.pos ?? "center",
          }}
        />
        <div className={s.fade} />
      </div>

      <div className={s.column}>
        <SectionHeader section={section} onClose={onClose} />
        <div className={s.title}>{section.title}</div>
        <div className={s.body}>{section.body}</div>

        <div className={s.items}>
          {section.layout === "work"
            ? section.items.map((item, index) => (
                <div key={item.k} className={s.rowWrap}>
                  <button
                    type="button"
                    className={s.row}
                    onClick={() => onExpand(index)}
                    {...hover}
                  >
                    <span className={s.rowKey}>{item.k}</span>
                    <span className={s.rowValue}>{item.v}</span>
                    <span className={s.rowAction}>Open file →</span>
                  </button>
                </div>
              ))
            : section.items.map((item) => (
                <div key={item.k} className={s.rowWrap}>
                  <div className={s.row}>
                    <span className={s.rowKey}>{item.k}</span>
                    <span className={s.rowValue}>{item.v}</span>
                    <span className={s.rowAction} />
                  </div>
                </div>
              ))}
        </div>

        <SectionFooter section={section} onStep={onStep} />
      </div>
    </div>
  );
}

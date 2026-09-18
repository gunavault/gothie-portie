"use client";

import { sections } from "@/lib/content";
import { useUi } from "./ui";
import s from "./rail.module.css";

export default function Rail({ onOpen }: { onOpen: (key: string) => void }) {
  const { hover } = useUi();

  return (
    <div className={s.rail}>
      <div className={s.grid}>
        {sections.map((section) => (
          <button
            key={section.key}
            type="button"
            className={s.item}
            onClick={() => onOpen(section.key)}
            {...hover}
          >
            <div className={s.meta}>
              <span>{section.label}</span>
              <span>{section.num}</span>
            </div>
            <div className={s.frame}>
              <div
                className={s.thumb}
                style={{
                  backgroundImage: `url("${section.img}")`,
                  backgroundPosition: section.pos ?? "center",
                }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { blogUrl } from "@/lib/content";
import { useSections, useUi } from "./ui";
import s from "./nav.module.css";

type Props = {
  sound: boolean;
  onToggleSound: () => void;
  onOpen: (key: string) => void;
};

export default function Nav({ sound, onToggleSound, onOpen }: Props) {
  const { hover } = useUi();
  const sections = useSections();

  return (
    <div className={s.nav}>
      <div className={s.logo}>
        GD<span className={s.dot}>.</span>26
      </div>

      <div className={s.links}>
        {sections.map((section) => (
          <button
            key={section.key}
            type="button"
            className={s.link}
            onClick={() => onOpen(section.key)}
            {...hover}
          >
            {section.label}
          </button>
        ))}
        <a className={s.blog} href={blogUrl} target="_blank" rel="noreferrer" {...hover}>
          Blog <span className={s.arrow}>↗</span>
        </a>
      </div>

      <div className={s.right}>
        <button
          type="button"
          className={s.sound}
          onClick={(event) => {
            event.stopPropagation();
            onToggleSound();
          }}
          {...hover}
        >
          <span className={sound ? s.barOn : s.bar} />
          {sound ? "Sound on" : "Sound off"}
        </button>
        <span className={s.location}>
          Jakarta, ID <span className={s.beacon} />
        </span>
      </div>
    </div>
  );
}

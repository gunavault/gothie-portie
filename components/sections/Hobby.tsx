"use client";

import { useSyncExternalStore } from "react";
import type { Section } from "@/lib/content";
import { SectionFooter, SectionHeader } from "../SectionChrome";
import { useUi } from "../ui";
import s from "./hobby.module.css";

type Props = {
  section: Section & { layout: "hobby" };
  onClose: () => void;
  onStep: (direction: number) => void;
};

const wide = [
  [14, 32],
  [36, 62],
  [52, 24],
  [70, 58],
  [86, 30],
];

/** A phone's star field is far narrower, so the constellation runs down it. */
const narrow = [
  [12, 6],
  [62, 26],
  [20, 50],
  [68, 72],
  [24, 92],
];

const query = "(max-width: 760px)";
const subscribe = (notify: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};

export default function Hobby({ section, onClose, onStep }: Props) {
  const { hover } = useUi();
  const isNarrow = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
  const points = isNarrow ? narrow : wide;

  return (
    <div className={s.stage}>
      <div className={s.backdrop} style={{ backgroundImage: `url("${section.img}")` }} />
      <div className={s.vignette} />

      <SectionHeader section={section} onClose={onClose} />

      <div className={s.hint}>
        <div className={s.title}>{section.title}</div>
        <div className={s.sub}>{section.body} — tap a star</div>
      </div>

      <div className={s.stars}>
        <svg className={s.lines} preserveAspectRatio="none">
          {points.slice(0, -1).map(([x1, y1], i) => {
            const [x2, y2] = points[i + 1];
            return (
              <line
                key={i}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke="rgba(240,201,135,.55)"
                strokeWidth="1"
                strokeDasharray="4 6"
              />
            );
          })}
        </svg>

        {section.items.map((item, i) => {
          const [x, y] = points[i];
          // stars near the right edge read their label back toward the middle
          const flip = x > (isNarrow ? 50 : 70);
          return (
            <div
              key={item.k}
              className={flip ? `${s.node} ${s.flip}` : s.node}
              style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${0.2 + i * 0.1}s` }}
              {...hover}
            >
              <div className={s.target}>
                <div className={s.dot} />
              </div>
              <div className={s.label}>{item.v}</div>
              <div className={s.note}>{item.note}</div>
            </div>
          );
        })}
      </div>

      <SectionFooter section={section} onStep={onStep} />
    </div>
  );
}

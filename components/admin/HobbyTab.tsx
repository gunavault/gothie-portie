"use client";

import type { AdminContent } from "@/lib/admin";
import { move, useDragList } from "./useDragList";
import s from "./admin.module.css";

type Props = {
  content: AdminContent;
  edit: (change: (draft: AdminContent) => void) => void;
};

export default function HobbyTab({ content, edit }: Props) {
  const { dragging, dragProps } = useDragList((from, to) =>
    edit((d) => move(d.hobbies, from, to)),
  );

  return (
    <div className={s.pane}>
      <div className={s.hobbyHead}>
        <span />
        <span>Hobby</span>
        <span>One-liner (shown on hover)</span>
        <span />
      </div>

      {content.hobbies.map((hobby, i) => (
        <div
          key={i}
          className={dragging === i ? s.hobbyRowDragging : s.hobbyRow}
          {...dragProps(i)}
        >
          <span className={s.grip}>⋮⋮</span>
          <input
            value={hobby.name}
            placeholder="Hobby"
            onChange={(e) => edit((d) => void (d.hobbies[i].name = e.target.value))}
          />
          <input
            value={hobby.note}
            placeholder="One line"
            onChange={(e) => edit((d) => void (d.hobbies[i].note = e.target.value))}
          />
          <div className={s.rowButtons}>
            <button
              type="button"
              className={s.iconTall}
              onClick={() => edit((d) => move(d.hobbies, i, i - 1))}
            >
              ↑
            </button>
            <button
              type="button"
              className={s.iconTall}
              onClick={() => edit((d) => move(d.hobbies, i, i + 1))}
            >
              ↓
            </button>
            <button
              type="button"
              className={s.removeTall}
              onClick={() =>
                confirm("Remove this item?") && edit((d) => void d.hobbies.splice(i, 1))
              }
            >
              ×
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        className={s.add}
        onClick={() => edit((d) => void d.hobbies.push({ name: "", note: "" }))}
      >
        + Add hobby
      </button>

      <div className={s.note}>
        The constellation places up to 5 stars; extra hobbies are stored but not shown.
      </div>
    </div>
  );
}

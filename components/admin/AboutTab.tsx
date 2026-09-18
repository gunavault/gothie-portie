"use client";

import type { AdminContent } from "@/lib/admin";
import s from "./admin.module.css";

type Props = {
  content: AdminContent;
  edit: (change: (draft: AdminContent) => void) => void;
};

export default function AboutTab({ content, edit }: Props) {
  return (
    <div className={s.pane}>
      <label className={s.field}>
        <span className={s.label}>Bio</span>
        <textarea
          className={s.bio}
          value={content.aboutBody}
          onChange={(e) => edit((d) => void (d.aboutBody = e.target.value))}
        />
      </label>

      <div className={s.label}>Fact rows</div>

      {content.facts.map((fact, i) => (
        <div key={i} className={s.factRow}>
          <input
            value={fact.label}
            placeholder="Label"
            onChange={(e) => edit((d) => void (d.facts[i].label = e.target.value))}
          />
          <input
            value={fact.value}
            placeholder="Value"
            onChange={(e) => edit((d) => void (d.facts[i].value = e.target.value))}
          />
          <button
            type="button"
            title="Remove"
            className={s.iconButton}
            onClick={() => edit((d) => void d.facts.splice(i, 1))}
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        className={s.add}
        onClick={() => edit((d) => void d.facts.push({ label: "", value: "" }))}
      >
        + Add row
      </button>
    </div>
  );
}

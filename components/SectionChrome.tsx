"use client";

import type { Section } from "@/lib/content";
import { useSections, useUi } from "./ui";
import s from "./section.module.css";

export function SectionHeader({
  section,
  onClose,
  raised,
}: {
  section: Section;
  onClose: () => void;
  raised?: boolean;
}) {
  const { hover } = useUi();
  return (
    <div className={raised ? s.headerRaised : s.header}>
      <span>
        {section.num} / 05 — {section.label}
      </span>
      <button type="button" className={s.close} onClick={onClose} {...hover}>
        Close — Esc
      </button>
    </div>
  );
}

export function SectionFooter({
  section,
  onStep,
  raised,
}: {
  section: Section;
  onStep: (direction: number) => void;
  raised?: boolean;
}) {
  const { hover } = useUi();
  const sections = useSections();
  const index = sections.findIndex((item) => item.key === section.key);
  const at = (offset: number) =>
    sections[(index + offset + sections.length) % sections.length].label;

  return (
    <div className={raised ? s.footerRaised : s.footer}>
      <button type="button" className={s.step} onClick={() => onStep(-1)} {...hover}>
        ← {at(-1)}
      </button>
      <button type="button" className={s.step} onClick={() => onStep(1)} {...hover}>
        {at(1)} →
      </button>
    </div>
  );
}

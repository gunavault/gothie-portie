"use client";

import { useEffect, useRef, useState } from "react";
import { email, type Channel, type Section } from "@/lib/content";
import { SectionFooter, SectionHeader } from "../SectionChrome";
import { useUi } from "../ui";
import s from "./contact.module.css";

type Props = {
  section: Section & { layout: "contact" };
  onClose: () => void;
  onStep: (direction: number) => void;
};

function Icon({ kind }: { kind: Channel["icon"] }) {
  if (kind === "in") return <span className={s.inGlyph}>in</span>;
  if (kind === "mail")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="5" width="18" height="14" rx="1" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    );
  if (kind === "ig")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

export default function Contact({ section, onClose, onStep }: Props) {
  const { sfx, hover } = useUi();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    sfx("tick");
    void navigator.clipboard?.writeText(email).catch(() => {});
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={s.stage}>
      <div className={s.image}>
        <div className={s.photo} style={{ backgroundImage: `url("${section.img}")` }} />
        <div className={s.fade} />
        <div className={s.scanlines} />
        <div className={s.signal}>
          <span className={s.beacon} />
          Signal open — Jakarta, UTC+7
        </div>
      </div>

      <div className={s.column}>
        <SectionHeader section={section} onClose={onClose} />

        <div className={s.head}>
          <div className={s.title}>Let&apos;s talk.</div>
          <div className={s.intro}>{section.body}</div>
        </div>

        <div className={s.channels}>
          {section.items.map((item, index) => (
            <a
              key={item.k}
              className={s.row}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              onClick={() => sfx("detail")}
              {...hover}
            >
              <div className={s.iconBox}>
                <Icon kind={item.icon} />
              </div>
              <div className={s.rowBody}>
                <div className={s.label}>{item.k}</div>
                <div className={s.detail}>
                  <span className={s.handle}>{item.v}</span>
                  <span className={s.hint}>{item.hint}</span>
                </div>
              </div>
              <div className={s.arrow}>↗</div>
            </a>
          ))}
        </div>

        <div className={s.actions}>
          <button type="button" className={s.copy} onClick={copy} {...hover}>
            {copied ? "Copied" : "Copy email"}
          </button>
          <span className={s.or}>or pick a channel above</span>
        </div>

        <SectionFooter section={section} onStep={onStep} />
      </div>
    </div>
  );
}

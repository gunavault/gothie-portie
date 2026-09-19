"use client";

import { useEffect, useState } from "react";
import s from "./notFound.module.css";

export default function NotFoundScreen() {
  // the 404 is statically rendered, so the address is only known in the browser
  const [requested, setRequested] = useState("unknown");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    const path = window.location.pathname.split("/").filter(Boolean).slice(-2).join("/");
    setRequested(path.length > 40 ? `${path.slice(0, 39)}…` : path || "unknown");
    setOrigin(window.location.host);
  }, []);

  return (
    <div className={s.stage}>
      <div className={s.monolith} />
      <div className={s.scrim} />
      <div className={s.flare} />
      <div className={s.scanlines} />
      <div className={s.scanBar} />

      <div className={s.header}>
        <a className={s.logo} href="/">
          GD<span className={s.dot}>.</span>26
        </a>
        <span className={s.signal}>
          <span className={s.beacon} />
          Signal lost
        </span>
      </div>

      <div className={s.foot}>
        <div className={s.block}>
          <div className={s.number}>404</div>
          <div className={s.lede}>
            You reached the edge
            <br />
            of what I&apos;ve built.
          </div>
          <div className={s.body}>
            Nothing lives at this address — yet. The way back is lit.
          </div>
          <div className={s.actions}>
            <a className={s.primary} href="/">
              Return to signal
            </a>
            <a className={s.secondary} href="/#contact">
              Contact instead
            </a>
          </div>
        </div>

        <div className={s.meta}>
          <div className={s.metaLead}>Error 404 · Not found</div>
          <div>Requested: /{requested}</div>
          <div>Origin: {origin}</div>
          <div>Jakarta · UTC +7</div>
        </div>
      </div>
    </div>
  );
}

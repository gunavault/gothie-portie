"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, svg } from "animejs";
import { holdOnPaths, holdOnViewBox } from "./holdOn";
import s from "./loader.module.css";

export default function Loader({ progress }: { progress: number }) {
  const root = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const paths = root.current?.querySelectorAll("path");
    if (!paths?.length) return;
    // letters draw in one after another, the whole word holds, then it erases
    const animation = animate(svg.createDrawable(paths), {
      draw: ["0 0", "0 1"],
      ease: "inOutQuad",
      duration: 900,
      // each letter erases after its own loopDelay, so this has to outlast the
      // stagger for the finished word to sit there long enough to read
      delay: stagger(60),
      loop: true,
      alternate: true,
      loopDelay: 1400,
    });
    return () => {
      animation.revert();
    };
  }, []);

  const percent = Math.round(progress * 100);

  return (
    <div className={s.stage}>
      <div className={s.glow} />

      <div className={s.word}>
        <svg ref={root} viewBox={holdOnViewBox} className={s.svg} aria-label="Hold on">
          {holdOnPaths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
      </div>

      <div className={s.status}>
        <span className={s.beacon} />
        Loading assets
        <span className={s.count}>{String(percent).padStart(3, "0")}%</span>
      </div>

      <div className={s.track}>
        <div className={s.bar} style={{ transform: `scaleX(${progress})` }} />
      </div>

      <div className={s.scanlines} />
    </div>
  );
}

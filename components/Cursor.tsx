import type { Ref } from "react";
import s from "./cursor.module.css";

export default function Cursor({ ref, hot }: { ref: Ref<HTMLDivElement>; hot: boolean }) {
  return (
    <div ref={ref} className={s.cursor}>
      <div className={hot ? s.reticleHot : s.reticle}>
        <span className={s.cornerTl} />
        <span className={s.cornerTr} />
        <span className={s.cornerBl} />
        <span className={s.cornerBr} />
        <span className={s.pip} />
        <span className={s.tickTop} />
        <span className={s.tickBottom} />
        <span className={s.tickLeft} />
        <span className={s.tickRight} />
      </div>
    </div>
  );
}

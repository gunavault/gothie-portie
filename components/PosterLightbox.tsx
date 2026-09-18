"use client";

import type { Movie } from "@/lib/content";
import { useUi } from "./ui";
import s from "./modal.module.css";

type Props = {
  item: Movie;
  voicePlaying: boolean;
  onClose: () => void;
  onStep: (direction: number) => void;
  onReplay: () => void;
};

export default function PosterLightbox({
  item,
  voicePlaying,
  onClose,
  onStep,
  onReplay,
}: Props) {
  const { hover } = useUi();
  const stop = (event: React.MouseEvent) => event.stopPropagation();

  return (
    <div className={s.lightbox} onClick={onClose}>
      <div className={s.glow} style={{ backgroundImage: `url("${item.poster}")` }} />
      <div className={s.posterWrap} onClick={stop}>
        <div className={s.poster} style={{ backgroundImage: `url("${item.poster}")` }} />
      </div>

      <div className={s.posterHead}>
        <span className={s.posterMeta}>
          <span className={s.posterIndex}>{item.k}</span>
          <span className={s.posterName}>{item.v}</span>
          <span className={s.posterType}>{item.type}</span>
        </span>
        <button
          type="button"
          className={s.close}
          onClick={(event) => {
            stop(event);
            onClose();
          }}
          {...hover}
        >
          Close — Esc
        </button>
      </div>

      <button
        type="button"
        className={s.arrowLeft}
        onClick={(event) => {
          stop(event);
          onStep(-1);
        }}
        {...hover}
      >
        ←
      </button>
      <button
        type="button"
        className={s.arrowRight}
        onClick={(event) => {
          stop(event);
          onStep(1);
        }}
        {...hover}
      >
        →
      </button>

      <div className={s.posterFoot}>
        <span className={s.posterQuote}>“{item.note}”</span>
        <button
          type="button"
          className={s.replay}
          onClick={(event) => {
            stop(event);
            onReplay();
          }}
          {...hover}
        >
          <span className={voicePlaying ? s.voiceBarOn : s.voiceBar} />
          {voicePlaying ? "Playing line" : "Replay line"}
        </button>
      </div>
    </div>
  );
}

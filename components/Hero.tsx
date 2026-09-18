import { hero } from "@/lib/config";
import s from "./hero.module.css";

export type Slice = {
  /** Slices flagged `alt` flicker the glitch image instead of the hero. */
  alt?: boolean;
  clipPath?: string;
  transform?: string;
  opacity?: number;
  filter?: string;
};

export type TitleOffset = {
  top: number;
  bot: number;
  dx: number;
  show: boolean;
  cyan: boolean;
};

type Props = {
  slices: Slice[];
  scanning: boolean;
  chrome: boolean;
  titleVisible: boolean;
  glitching: boolean;
  titleOffsets: TitleOffset[];
};

const Title = () => (
  <div className={s.titleText}>
    <div>Guna</div>
    <div>Dharma</div>
  </div>
);

export default function Hero({
  slices,
  scanning,
  chrome,
  titleVisible,
  glitching,
  titleOffsets,
}: Props) {
  return (
    <>
      <div className={s.hero}>
        {slices.map((slice, i) => {
          const clip = slice.alt ? hero.glitch : hero.main;
          return (
            <div
              key={i}
              className={s.slice}
              style={{
                clipPath: slice.clipPath,
                transform: slice.transform,
                opacity: slice.opacity,
                filter: slice.filter,
              }}
            >
              <div
                className={s.image}
                style={{
                  backgroundImage: `url("${clip.img}")`,
                  backgroundPosition: clip.pos,
                  filter: clip.filter,
                }}
              />
            </div>
          );
        })}
        <div className={s.scrim} />
        <div className={s.scanlines} />
        {scanning && <div className={s.scanBar} />}
      </div>

      <div className={s.title}>
        {chrome && (
          <div className={s.eyebrow}>
            <span className={s.rule} />
            Portfolio — 2026
          </div>
        )}

        <div className={s.titleStack}>
          {titleVisible && glitching
            ? titleOffsets
                .map((offset, i) => (
                  <div
                    key={i}
                    className={s.titleLayer}
                    style={{
                      clipPath: `inset(${offset.top}% 0 ${offset.bot}% 0)`,
                      transform: `translateX(${offset.dx}px)`,
                      opacity: offset.show ? 1 : 0,
                      filter: offset.cyan ? "hue-rotate(-30deg) brightness(1.5)" : "none",
                    }}
                  >
                    <Title />
                  </div>
                ))
                // an invisible in-flow copy holds the block's height while slices float
                .concat(
                  <div key="spacer" className={s.titleSpacer}>
                    <Title />
                  </div>,
                )
            : titleVisible && (
                <div className={s.titleSettled}>
                  <Title />
                </div>
              )}
        </div>

        {chrome && (
          <div className={s.bio}>
            <div className={s.bioText}>
              Cybersecurity engineer &amp; software developer in Jakarta. Securing
              high-stakes systems by day — designing, shooting and watching films by night.
            </div>
            <div className={s.bioAside}>
              <div className={s.bioOpen}>Open for collaboration</div>
              <div className={s.bioHint}>Choose a section below ↓</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

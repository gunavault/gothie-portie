export const config = {
  /** Multiplies the intro reveal duration. */
  revealSpeed: 0.75,
  /** Jump straight to the finished hero, no loader or glitch. */
  skipIntro: false,
  /** Ambient sound starts on, unless localStorage says otherwise. */
  soundDefault: false,
  /** Sound played when a section takes over the screen. */
  openSound: "cinematic-hit" as OpenSound,
  /** Ring + flash on click, on top of the shutter sound. */
  shootFx: false,
};

export type OpenSound =
  | "cinematic-hit"
  | "dark-whisper"
  | "bell-in-the-void"
  | "radio-signal";

export const hero = {
  main: {
    img: "/media/hero-main.jpg",
    pos: "center 30%",
    filter: "saturate(.6) contrast(1.1) brightness(.85)",
  },
  /** Flickers through the intro's glitch slices before the hero settles. */
  glitch: {
    img: "/media/hero-glitch.jpg",
    pos: "center 40%",
    filter: "saturate(.5) contrast(1.1) brightness(.75)",
  },
};

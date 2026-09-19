"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { config, hero } from "@/lib/config";
import type { Section } from "@/lib/content";
import { SoundEngine, type Sfx } from "@/lib/sound";
import { SectionsProvider, UiProvider } from "./ui";
import Hero, { type Slice, type TitleOffset } from "./Hero";
import Nav from "./Nav";
import Rail from "./Rail";
import Takeover from "./Takeover";
import Cursor from "./Cursor";
import Loader from "./Loader";
import s from "./portfolio.module.css";

type Phase = "loading" | "image" | "title" | "ready";
type Shot = { id: number; x: number; y: number };

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Nothing is shown until everything is in, so a stalled asset must not trap anyone. */
const LOAD_CEILING = 12000;

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });

// pulls the whole body so the file is in the HTTP cache before a voice line plays
const preloadAudio = async (src: string) => {
  try {
    await (await fetch(src)).arrayBuffer();
  } catch {}
};

export default function Portfolio({ sections }: { sections: Section[] }) {
  const [phase, setPhase] = useState<Phase>(config.skipIntro ? "ready" : "loading");
  const [slices, setSlices] = useState<Slice[]>([{}]);
  const [titleOffsets, setTitleOffsets] = useState<TitleOffset[]>([]);
  const [glitching, setGlitching] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [poster, setPoster] = useState<number | null>(null);
  const [hot, setHot] = useState(false);
  const [shots, setShots] = useState<Shot[]>([]);
  const [flash, setFlash] = useState(false);
  const [sound, setSound] = useState(false);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const cursorRef = useRef<HTMLDivElement>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const engineRef = useRef<SoundEngine | null>(null);
  const engine = () => (engineRef.current ??= new SoundEngine());

  const sfx = useCallback((kind: Sfx) => engine().play(kind), []);

  const openIndex = sections.findIndex((section) => section.key === openKey);
  const open = openIndex >= 0 ? sections[openIndex] : null;

  const setSoundOn = useCallback((on: boolean) => {
    const sound = engine();
    sound.openSound = config.openSound;
    sound.setEnabled(on);
    setSound(on);
    try {
      localStorage.setItem("gd-sound", on ? "1" : "0");
    } catch {}
  }, []);

  const stopVoice = useCallback(() => {
    if (voiceRef.current) {
      voiceRef.current.pause();
      voiceRef.current = null;
    }
    setVoicePlaying(false);
    engine().duck(false);
  }, []);

  const playVoice = useCallback(
    (src: string) => {
      stopVoice();
      const audio = new Audio(src);
      audio.volume = 0.9;
      voiceRef.current = audio;
      audio.onended = () => {
        if (voiceRef.current !== audio) return;
        voiceRef.current = null;
        setVoicePlaying(false);
        engine().duck(false);
      };
      // asked-for lines play regardless of the ambient sound toggle
      audio.play().then(() => setVoicePlaying(true), () => {});
      engine().duck(true);
    },
    [stopVoice],
  );

  // sound preference, armed on the first gesture (browsers block audio before one)
  useEffect(() => {
    let want = config.soundDefault;
    try {
      const stored = localStorage.getItem("gd-sound");
      if (stored !== null) want = stored === "1";
    } catch {}
    setSound(want);
    if (!want) return;
    const arm = () => setSoundOn(true);
    window.addEventListener("pointerdown", arm, { once: true });
    window.addEventListener("keydown", arm, { once: true });
    return () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
    };
  }, [setSoundOn]);

  useEffect(() => {
    const sound = engineRef.current;
    return () => sound?.dispose();
  }, []);

  // held on the loader until every image, voice line and font is in
  useEffect(() => {
    if (config.skipIntro) return;
    let cancelled = false;
    let timer: ReturnType<typeof setInterval>;

    const glitchTitle = () => {
      const start = performance.now();
      const duration = 650 * config.revealSpeed;
      setGlitching(true);
      timer = setInterval(() => {
        const progress = (performance.now() - start) / duration;
        if (progress >= 1) {
          clearInterval(timer);
          setGlitching(false);
          setTitleOffsets([]);
          setTimeout(() => !cancelled && setPhase("ready"), 120 * config.revealSpeed);
          return;
        }
        const rows = 6;
        setTitleOffsets(
          Array.from({ length: rows }, (_, i) => ({
            top: (i / rows) * 100,
            bot: 100 - ((i + 1) / rows) * 100,
            dx: (Math.random() - 0.5) * 90 * (1 - progress),
            show: Math.random() < 0.25 + progress * 0.85,
            cyan: Math.random() < 0.35,
          })),
        );
      }, 55);
    };

    const startReveal = () => {
      if (cancelled) return;
      setPhase("image");
      sfx("glitch");
      const start = performance.now();
      timer = setInterval(() => {
        const progress = (performance.now() - start) / (350 * config.revealSpeed);
        if (progress >= 1) {
          clearInterval(timer);
          setSlices([{}]);
          setPhase("title");
          glitchTitle();
          return;
        }
        const rows = 7;
        setSlices(
          Array.from({ length: rows }, (_, i) => ({
            alt: Math.random() > progress * 1.2,
            clipPath: `inset(${(i / rows) * 100}% 0 ${100 - ((i + 1) / rows) * 100}% 0)`,
            transform: `translateX(${(Math.random() - 0.5) * 60 * (1 - progress)}px)`,
            opacity: Math.random() < progress + 0.3 ? 1 : 0,
            filter: Math.random() < 0.3 ? "hue-rotate(40deg) brightness(1.4)" : "none",
          })),
        );
      }, 45);
    };

    const images = [
      ...sections.map((section) => section.img),
      ...sections.flatMap((section) =>
        section.layout === "movie" ? section.items.map((item) => item.poster) : [],
      ),
      hero.main.img,
      hero.glitch.img,
    ];
    const voices = sections.flatMap((section) =>
      section.layout === "movie" ? section.items.map((item) => item.voice) : [],
    );

    const jobs = [
      ...images.map(preloadImage),
      ...voices.map(preloadAudio),
      document.fonts.ready,
    ];
    let done = 0;
    const counted = jobs.map((job) =>
      job.then(() => {
        done += 1;
        if (!cancelled) setProgress(done / jobs.length);
      }),
    );

    const everything = Promise.all([...counted, wait(900)]);
    Promise.race([everything, wait(LOAD_CEILING)]).then(() => {
      if (cancelled) return;
      setProgress(1);
      startReveal();
    });

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [sfx, sections]);

  const closeSection = useCallback(() => {
    sfx("close");
    stopVoice();
    setOpenKey(null);
  }, [sfx, stopVoice]);

  const closePoster = useCallback(() => {
    sfx("close");
    stopVoice();
    setPoster(null);
  }, [sfx, stopVoice]);

  const showPoster = useCallback(
    (index: number, voice: string) => {
      setPoster(index);
      playVoice(voice);
    },
    [playVoice],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (poster !== null) closePoster();
        else if (expanded !== null) {
          sfx("close");
          setExpanded(null);
        } else if (openKey) closeSection();
        return;
      }
      if (poster === null || !open || open.layout !== "movie") return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const step = event.key === "ArrowRight" ? 1 : open.items.length - 1;
      const next = (poster + step) % open.items.length;
      sfx("tick");
      showPoster(next, open.items[next].voice);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [poster, expanded, openKey, open, sfx, closePoster, closeSection, showPoster]);

  const openSection = useCallback(
    (key: string) => {
      sfx("open");
      setOpenKey(key);
      setExpanded(null);
      setPoster(null);
    },
    [sfx],
  );

  const step = (direction: number) => {
    sfx("open");
    const next = (openIndex + direction + sections.length) % sections.length;
    stopVoice();
    setOpenKey(sections[next].key);
    setExpanded(null);
    setPoster(null);
  };

  const onMove = (event: React.MouseEvent) => {
    const el = cursorRef.current;
    if (el) el.style.transform = `translate(${event.clientX - 17}px,${event.clientY - 17}px)`;
  };

  const onShoot = (event: React.MouseEvent) => {
    if (phase !== "ready") return;
    sfx("shot");
    if (!config.shootFx) return;
    const id = Date.now() + Math.random();
    setShots((current) => [...current, { id, x: event.clientX, y: event.clientY }]);
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
    setTimeout(() => setShots((current) => current.filter((shot) => shot.id !== id)), 500);
  };

  const ui = useMemo(() => ({ sfx, setHot }), [sfx]);
  const chrome = phase === "ready";

  return (
    <UiProvider value={ui}>
      <SectionsProvider value={sections}>
        <div className={s.root} onMouseMove={onMove} onMouseDown={onShoot}>
          <Hero
            slices={slices}
            scanning={phase === "ready"}
            chrome={chrome}
            titleVisible={phase === "title" || phase === "ready"}
            glitching={glitching}
            titleOffsets={titleOffsets}
          />

          {chrome && (
            <Nav
              sound={sound}
              onToggleSound={() => setSoundOn(!sound)}
              onOpen={openSection}
            />
          )}

          {chrome && <Rail onOpen={openSection} />}

          {open && (
            <Takeover
              section={open}
              expanded={expanded}
              poster={poster}
              voicePlaying={voicePlaying}
              onClose={closeSection}
              onStep={step}
              onExpand={(index) => {
                sfx("detail");
                setExpanded(index);
              }}
              onCollapse={() => {
                sfx("close");
                setExpanded(null);
              }}
              onShowPoster={(index, voice) => {
                sfx("detail");
                showPoster(index, voice);
              }}
              onStepPoster={(index, voice) => {
                sfx("tick");
                showPoster(index, voice);
              }}
              onClosePoster={closePoster}
              onReplayVoice={playVoice}
            />
          )}

          {phase === "loading" && <Loader progress={progress} />}

          {shots.map((shot) => (
            <div key={shot.id} className={s.shot} style={{ left: shot.x, top: shot.y }} />
          ))}
          {flash && <div className={s.flash} />}

          <Cursor ref={cursorRef} hot={hot} />
        </div>
      </SectionsProvider>
    </UiProvider>
  );
}

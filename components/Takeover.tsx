"use client";

import type { Section } from "@/lib/content";
import Standard from "./sections/Standard";
import Hobby from "./sections/Hobby";
import Movie from "./sections/Movie";
import Contact from "./sections/Contact";
import WorkDossier from "./WorkDossier";
import PosterLightbox from "./PosterLightbox";
import s from "./section.module.css";

type Props = {
  section: Section;
  expanded: number | null;
  poster: number | null;
  voicePlaying: boolean;
  onClose: () => void;
  onStep: (direction: number) => void;
  onExpand: (index: number) => void;
  onCollapse: () => void;
  onShowPoster: (index: number, voice: string) => void;
  onStepPoster: (index: number, voice: string) => void;
  onClosePoster: () => void;
  onReplayVoice: (voice: string) => void;
};

export default function Takeover({
  section,
  expanded,
  poster,
  voicePlaying,
  onClose,
  onStep,
  onExpand,
  onCollapse,
  onShowPoster,
  onStepPoster,
  onClosePoster,
  onReplayVoice,
}: Props) {
  const workFile =
    section.layout === "work" && expanded !== null ? section.items[expanded] : null;
  const showing =
    section.layout === "movie" && poster !== null ? section.items[poster] : null;

  return (
    <div className={s.takeover}>
      {(section.layout === "about" || section.layout === "work") && (
        <Standard section={section} onClose={onClose} onStep={onStep} onExpand={onExpand} />
      )}
      {section.layout === "hobby" && (
        <Hobby section={section} onClose={onClose} onStep={onStep} />
      )}
      {section.layout === "movie" && (
        <Movie
          section={section}
          onClose={onClose}
          onStep={onStep}
          onShowPoster={onShowPoster}
        />
      )}
      {section.layout === "contact" && (
        <Contact section={section} onClose={onClose} onStep={onStep} />
      )}

      {workFile && <WorkDossier item={workFile} onClose={onCollapse} />}

      {showing && section.layout === "movie" && (
        <PosterLightbox
          item={showing}
          voicePlaying={voicePlaying}
          onClose={onClosePoster}
          onStep={(direction) => {
            const count = section.items.length;
            const next = (poster! + direction + count) % count;
            onStepPoster(next, section.items[next].voice);
          }}
          onReplay={() => onReplayVoice(showing.voice)}
        />
      )}
    </div>
  );
}

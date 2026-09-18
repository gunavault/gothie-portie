"use client";

import { createContext, useContext } from "react";
import type { Sfx } from "@/lib/sound";

type Ui = { sfx: (kind: Sfx) => void; setHot: (on: boolean) => void };

const UiContext = createContext<Ui>({ sfx: () => {}, setHot: () => {} });

export const UiProvider = UiContext.Provider;

export function useUi() {
  const ui = useContext(UiContext);
  return {
    ...ui,
    /** Spread onto anything clickable: ticks, and swells the crosshair. */
    hover: {
      onMouseEnter: () => {
        ui.sfx("tick");
        ui.setHot(true);
      },
      onMouseLeave: () => ui.setHot(false),
    },
  };
}

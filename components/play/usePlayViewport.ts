"use client";

import { useEffect, useState } from "react";

export function usePlayViewport() {
  const [viewport, setViewport] = useState({ narrow: false, height: undefined as number | undefined });
  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px), (max-aspect-ratio: 4/5), (max-height: 520px)");
    const update = () => setViewport({ narrow: media.matches, height: window.visualViewport?.height });
    update();
    media.addEventListener("change", update);
    window.visualViewport?.addEventListener("resize", update);
    return () => { media.removeEventListener("change", update); window.visualViewport?.removeEventListener("resize", update); };
  }, []);
  return viewport;
}

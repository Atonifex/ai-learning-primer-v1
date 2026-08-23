"use client";

import { useEffect, useRef } from "react";
import {
  createBeachWorld,
  type BeachWorldHandle,
} from "./beachWorld";
import type { PinId } from "../../lib/play/beachMap";

export default function OverworldCanvas(props: {
  paused: boolean;
  quizDone: boolean;
  talkedToWreck: boolean;
  onArriveAtPin: (id: PinId) => void;
  onWanderFromWreck: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<BeachWorldHandle | null>(null);
  const cbRef = useRef({
    onArriveAtPin: props.onArriveAtPin,
    onWanderFromWreck: props.onWanderFromWreck,
  });
  cbRef.current = {
    onArriveAtPin: props.onArriveAtPin,
    onWanderFromWreck: props.onWanderFromWreck,
  };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    void createBeachWorld(host, {
      onArriveAtPin: (id) => cbRef.current.onArriveAtPin(id),
      onWanderFromWreck: () => cbRef.current.onWanderFromWreck(),
    }).then((world) => {
      if (cancelled) {
        world.destroy();
        return;
      }
      worldRef.current = world;
      world.setPaused(props.paused);
      world.setQuizDone(props.quizDone);
      world.setTalkedToWreck(props.talkedToWreck);
    });
    return () => {
      cancelled = true;
      worldRef.current?.destroy();
      worldRef.current = null;
    };
    // Init once — live flags are pushed below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    worldRef.current?.setPaused(props.paused);
  }, [props.paused]);

  useEffect(() => {
    worldRef.current?.setQuizDone(props.quizDone);
  }, [props.quizDone]);

  useEffect(() => {
    worldRef.current?.setTalkedToWreck(props.talkedToWreck);
  }, [props.talkedToWreck]);

  return (
    <div
      ref={hostRef}
      className="h-full w-full touch-none bg-[#0a3340]"
      aria-label="Island beach. Tap to walk. WASD on a keyboard."
    />
  );
}

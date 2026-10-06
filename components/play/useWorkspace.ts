"use client";

import { useCallback, useRef, useState, type SetStateAction } from "react";
import { changeWorkspace, type WorkspacePanel } from "../../lib/play/dialogueLayout";

export function useWorkspace(initial: WorkspacePanel | null = null) {
  const [panel, setPanel] = useState<WorkspacePanel | null>(initial);
  const opener = useRef<HTMLElement | null>(null);
  const setOpen = useCallback((target: WorkspacePanel, value: SetStateAction<boolean>) => {
    if (value !== false && typeof document !== "undefined" && document.activeElement instanceof HTMLElement) opener.current = document.activeElement;
    setPanel((current) => changeWorkspace(current, target, typeof value === "function" ? value(current === target) : value));
  }, []);
  return { panel, setPanel, setOpen, opener };
}

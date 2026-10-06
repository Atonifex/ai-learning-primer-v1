"use client";

import { useContext, useEffect, useRef } from "react";
import { EmbeddedActivity } from "./ActivitySurface";

/** Keep keyboard users in the current learning task, then return to its opener. */
export function restoreWorkspaceFocus(opener: HTMLElement | null) {
  if (opener?.isConnected && opener.getClientRects().length && !opener.closest("[inert],[hidden]")) opener.focus();
  else document.querySelector<HTMLButtonElement>(".dialogue-dock:not([hidden]) .dialogue-controls button")?.focus();
}

export function useDialogFocus(onClose?: () => void, enabled = true, restore?: () => void) {
  const embedded = useContext(EmbeddedActivity);
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  const restoreRef = useRef(restore);
  useEffect(() => { restoreRef.current = restore; }, [restore]);
  useEffect(() => { close.current = onClose; }, [onClose]);
  useEffect(() => {
    if (embedded || !enabled) return;
    const dialog = ref.current;
    if (!dialog) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape" && close.current) { event.preventDefault(); event.stopPropagation(); close.current(); return; }
      if (event.key !== "Tab") return;
      const controls = [...dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), summary, [tabindex="0"]')].filter((node) => node.getClientRects().length > 0 && !node.closest("[inert]"));
      const first = controls[0], last = controls.at(-1);
      if (!first) { event.preventDefault(); dialog.focus(); return; }
      if (!dialog.contains(document.activeElement) || document.activeElement === dialog) { event.preventDefault(); (event.shiftKey ? last : first)?.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    dialog.addEventListener("keydown", key);
    return () => { dialog.removeEventListener("keydown", key); if (restoreRef.current) restoreRef.current(); else restoreWorkspaceFocus(opener); };
  }, [embedded, enabled]);
  return ref;
}

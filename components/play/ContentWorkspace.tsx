"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { EmbeddedActivity } from "./ActivitySurface";
import { useDialogFocus } from "./useDialogFocus";

export default function ContentWorkspace(props: {
  title: string; narrow: boolean; maximized: boolean;
  hidden?: boolean;
  onMaximize: () => void; onClose?: () => void; children: ReactNode;
}) {
  const ref = useDialogFocus(props.onClose, props.narrow && !props.hidden);
  const opener = useRef<HTMLElement | null>(null);
  const onClose = useRef(props.onClose); onClose.current = props.onClose;
  useEffect(() => {
    if (props.hidden) return;
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!props.narrow) ref.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (props.narrow || event.key !== "Escape" || event.defaultPrevented || !onClose.current) return;
      // Nested definitions consume Escape first; capture neither document nor child events.
      event.preventDefault(); onClose.current();
    };
    const el = ref.current; el?.addEventListener("keydown", key);
    return () => { el?.removeEventListener("keydown", key); if (!props.narrow && opener.current?.isConnected) opener.current.focus(); };
  }, [props.narrow, props.hidden, ref]);
  return <section ref={ref} hidden={props.hidden} inert={props.hidden || undefined} tabIndex={-1} className="content-workspace" data-testid="content-workspace"
    role={props.narrow ? "dialog" : "region"} aria-modal={props.narrow || undefined} aria-label={props.title}>
    <header className="workspace-header">
      <h2>{props.title}</h2>
      <div>
        {!props.narrow && <button type="button" onClick={props.onMaximize} aria-label={props.maximized ? "Restore panel size" : "Maximize panel"}>{props.maximized ? "Restore" : "Maximize"}</button>}
        {props.onClose && <button type="button" onClick={props.onClose} aria-label="Close content panel">Back to conversation <span aria-hidden>×</span></button>}
      </div>
    </header>
    <EmbeddedActivity.Provider value={true}><div className="workspace-body">{props.children}</div></EmbeddedActivity.Provider>
  </section>;
}

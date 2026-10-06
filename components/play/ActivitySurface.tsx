"use client";

import { createContext, useContext, type ComponentProps } from "react";

export const EmbeddedActivity = createContext(false);

/** Separate a tool's content from its legacy full-screen overlay presentation. */
export default function ActivitySurface({ className, role, "aria-modal": ariaModal, ...props }: ComponentProps<"div">) {
  const embedded = useContext(EmbeddedActivity);
  return <div {...props} className={embedded ? "activity-surface" : className}
    role={embedded ? "region" : role} aria-modal={embedded ? undefined : ariaModal} />;
}

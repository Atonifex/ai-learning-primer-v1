import { isHiddenTurn } from "./hiddenTurns";
import type { StillKey } from "./stills";

export type DialogueSpeaker = {
  id: string;
  name: string;
  role: string;
  portrait: StillKey;
  /** Other speakers must explicitly supply their own speech integration. */
  voice: "rho" | null;
};

export const RHO_SPEAKER: DialogueSpeaker = {
  id: "rho", name: "Rho", role: "First Mate", portrait: "rhoPortraitNeutral", voice: "rho",
};

type Turn = { role: "USER" | "ASSISTANT"; content: string; streaming?: boolean };
export function visibleDialogue<T extends Turn>(messages: T[]): T[] {
  return messages.filter((message) => (message.content.trim() || message.streaming) && !isHiddenTurn(message.content));
}

/** Keep the latest learner turn and its replies together, including a streaming reply. */
export function latestExchange<T extends Turn>(messages: T[]): T[] {
  const visible = visibleDialogue(messages);
  const lastUser = visible.findLastIndex((message) => message.role === "USER");
  return lastUser < 0 ? visible.slice(-1) : visible.slice(lastUser);
}

export type WorkspacePanel = "history" | "map" | "board" | "focus" | "math" | "quiz" | "reflection" | "garden" | "gardenTeach" | "clip";
export const WORKSPACE_PANELS: Record<WorkspacePanel, { title: string; wide: boolean }> = {
  history: { title: "Conversation history", wide: false },
  map: { title: "Island map", wide: true },
  board: { title: "Camp needs", wide: false },
  focus: { title: "Learning focus", wide: true },
  math: { title: "Math starting check", wide: false },
  quiz: { title: "Island job", wide: false },
  reflection: { title: "Crew log", wide: false },
  garden: { title: "Treeline garden", wide: true },
  gardenTeach: { title: "What plants need", wide: true },
  clip: { title: "Learning clip", wide: true },
};

/** Closing an old surface must never close a newly opened one. */
export function changeWorkspace(current: WorkspacePanel | null, panel: WorkspacePanel, open: boolean): WorkspacePanel | null {
  return open ? panel : current === panel ? null : current;
}

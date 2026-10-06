import type { MissionPublic } from "./missions";

/** One shared direction for the board and Rho. Locked work never becomes startable. */
export function nextCampAction(missions: MissionPublic[], placementReady: boolean) {
  const wreck = missions.find((m) => m.id === "wreck-math");
  if (wreck?.status === "available") return { kind: "mission" as const, missionId: wreck.id,
    title: "Save supplies from the wreck", detail: "Count the crates so we know what the crew can use.", label: "Start wreck salvage" };
  if (!placementReady) return { kind: "check" as const,
    title: "Find your math starting point", detail: "Try up to 5 short questions. Mistakes help Rho choose what to practice. There is no timer.", label: "Start math check" };
  const next = missions.find((m) => m.status === "available");
  if (next) return { kind: "mission" as const, missionId: next.id, title: next.title,
    detail: next.theme, label: "Start next camp need" };
  const allDone = missions.length > 0 && missions.every((mission) => mission.status === "completed");
  return { kind: "focus" as const, title: allDone ? "Your shore jobs are complete" : "Choose where to practice",
    detail: "Choose a subject to practice, or explore the island with Rho.", label: "Choose a subject" };
}

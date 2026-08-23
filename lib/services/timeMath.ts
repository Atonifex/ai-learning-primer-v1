/** Pure clock helpers — no Prisma. Safe for child HUD and unit tests. */

export function secondsBetween(start: Date, end: Date): number {
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 1000));
}

export function formatHiddenMinutes(totalSeconds: number): string {
  const minutes = Math.max(0, Math.round(totalSeconds / 60));
  if (minutes < 1) return "under a minute";
  if (minutes === 1) return "1 minute";
  return `${minutes} minutes`;
}

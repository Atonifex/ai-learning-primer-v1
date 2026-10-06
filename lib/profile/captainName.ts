export const CAPTAIN_NAME_MAX_LENGTH = 40;

/** Display fallback only: never replace an existing chosen name in storage. */
export function captainDisplayName(displayName: string | null | undefined, username?: string | null): string {
  return displayName?.trim() || username?.trim() || "Captain";
}

export function validCaptainName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const name = value.trim();
  if (!name || name.length > CAPTAIN_NAME_MAX_LENGTH || /[\u0000-\u001f\u007f]/.test(value)) return null;
  return name;
}

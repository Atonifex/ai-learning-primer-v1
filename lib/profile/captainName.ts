export const CAPTAIN_NAME_MAX_LENGTH = 40;

export function validCaptainName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const name = value.trim();
  if (!name || name.length > CAPTAIN_NAME_MAX_LENGTH || /[\u0000-\u001f\u007f]/.test(value)) return null;
  return name;
}

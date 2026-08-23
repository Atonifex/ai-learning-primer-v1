/** Child login username + 4-digit PIN (COPPA: no child email). */

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;
export const PIN_LENGTH = 4;

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;
const PIN_RE = /^\d{4}$/;

export function normalizeUsername(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim().toLowerCase();
  if (!USERNAME_RE.test(value)) return null;
  return value;
}

export function parsePin(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (!PIN_RE.test(value)) return null;
  return value;
}

export function usernameError(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw.trim()) {
    return "Pick a captain login (letters, numbers, underscore).";
  }
  const value = raw.trim().toLowerCase();
  if (value.length < USERNAME_MIN || value.length > USERNAME_MAX) {
    return `Login must be ${USERNAME_MIN}–${USERNAME_MAX} characters.`;
  }
  if (!USERNAME_RE.test(value)) {
    return "Use only lowercase letters, numbers, and underscore.";
  }
  return null;
}

export function pinError(raw: unknown): string | null {
  if (parsePin(raw) == null) return "PIN must be 4 digits.";
  return null;
}

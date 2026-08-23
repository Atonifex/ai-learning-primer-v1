/** In-memory PIN attempt limiter (per-process; enough for a single Vercel instance). */

const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 8;

const attempts = new Map<string, { count: number; resetAt: number }>();

export function pinLockRemainingMs(username: string): number {
  const row = attempts.get(username);
  if (!row) return 0;
  if (Date.now() > row.resetAt) {
    attempts.delete(username);
    return 0;
  }
  if (row.count < MAX_ATTEMPTS) return 0;
  return row.resetAt - Date.now();
}

export function recordPinFailure(username: string): void {
  const now = Date.now();
  const row = attempts.get(username);
  if (!row || now > row.resetAt) {
    attempts.set(username, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  row.count += 1;
}

export function clearPinFailures(username: string): void {
  attempts.delete(username);
}

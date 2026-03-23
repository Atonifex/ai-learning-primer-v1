import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "../../lib/auth/session";
import { getProfile } from "../../lib/services/profile";
import { listSessions } from "../../lib/services/session";
import type { SessionData } from "../../lib/types";

const LANG_LABELS: Record<string, string> = { ES: "Spanish", ZH: "Chinese" };
const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "In progress",
  COMPLETED: "Completed",
  ABANDONED: "Abandoned",
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function SessionsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getProfile(user.userId);
  if (!profile) redirect("/onboarding");

  const sessions = await listSessions(profile.id);
  const activeSessions = sessions.filter((s) => s.status === "ACTIVE");
  const pastSessions = sessions.filter((s) => s.status !== "ACTIVE");

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tight">Primer</span>
        <Link
          href="/learn"
          className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
        >
          New session
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-stone-900 mb-8">Your sessions</h1>

        {activeSessions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
              In progress
            </h2>
            <div className="space-y-3">
              {activeSessions.map((s) => (
                <SessionCard key={s.id} session={s} active />
              ))}
            </div>
          </div>
        )}

        {pastSessions.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
              Past sessions
            </h2>
            <div className="space-y-3">
              {pastSessions.map((s) => (
                <SessionCard key={s.id} session={s} />
              ))}
            </div>
          </div>
        )}

        {sessions.length === 0 && (
          <div className="text-center py-16">
            <p className="text-stone-400 text-sm">No sessions yet.</p>
            <Link
              href="/learn"
              className="mt-4 inline-block px-6 py-3 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors"
            >
              Start your first session
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

function SessionCard({ session, active }: { session: SessionData; active?: boolean }) {
  const msgCount = session.messages.filter(
    (m) => m.content && m.content !== "__start__"
  ).length;

  void STATUS_LABELS;

  return (
    <Link
      href={`/learn/${session.id}`}
      className={`block bg-white rounded-xl border p-4 hover:border-amber-300 transition-colors group ${
        active ? "border-amber-200" : "border-stone-100"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-stone-900 group-hover:text-amber-800 transition-colors truncate">
              {session.arcName || "Session"}
            </span>
            {active && (
              <span className="flex-shrink-0 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span>{LANG_LABELS[session.language] || session.language}</span>
            <span>·</span>
            <span>{formatDate(session.startedAt)}</span>
            <span>·</span>
            <span>{msgCount} messages</span>
          </div>
        </div>
        <svg
          className="w-4 h-4 text-stone-300 group-hover:text-amber-500 transition-colors flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

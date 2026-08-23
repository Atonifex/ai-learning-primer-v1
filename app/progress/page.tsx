import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth/session";
import { getProfile } from "../../lib/services/profile";
import {
  getLatestChapterReflection,
  getLearnerTimeSummary,
  getRecentObservations,
  getSkillProgressOverview,
  getSubjectProgressOverview,
} from "../../lib/services/progress";
import { formatHiddenMinutes } from "../../lib/services/timeMath";

export default async function ProgressPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getProfile(user.userId);
  if (!profile) redirect("/onboarding");

  const [subjects, skills, observations, crewLog, time] = await Promise.all([
    getSubjectProgressOverview(profile.id),
    getSkillProgressOverview(profile.id),
    getRecentObservations(profile.id, 6),
    getLatestChapterReflection(profile.id),
    getLearnerTimeSummary(profile.id),
  ]);
  const topSkills = skills.slice(0, 8);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Your Progress</h1>
          <p className="mt-2 text-sm text-stone-600">
            Explore growth by subject standards and cross-subject skills.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/settings"
            className="text-sm font-medium text-stone-600 hover:text-stone-900 hover:underline"
          >
            Settings
          </Link>
          <Link
            href="/progress/skills"
            className="text-sm font-medium text-amber-700 hover:text-amber-900 hover:underline"
          >
            All skills →
          </Link>
        </div>
      </div>

      <section className="mt-8 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            Time on the island
          </h2>
          <p className="mt-2 text-sm text-stone-800">
            Lifetime: {formatHiddenMinutes(time.lifetimeSeconds)} · last sitting:{" "}
            {time.lastSessionSeconds == null
              ? "none yet"
              : formatHiddenMinutes(time.lastSessionSeconds)}
          </p>
          <p className="mt-1 text-xs text-stone-500">
            No daily cap. Activity work: {formatHiddenMinutes(time.activitySeconds)}.
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            Crew log
          </h2>
          {crewLog ? (
            <p className="mt-2 text-sm text-stone-800">“{crewLog.text}”</p>
          ) : (
            <p className="mt-2 text-sm text-stone-500">
              A chapter note for the missing engineer will appear here.
            </p>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
          Recent observations
        </h2>
        <div className="rounded-xl border border-stone-200 bg-white">
          {observations.length === 0 ? (
            <p className="p-4 text-sm text-stone-600">
              Finish the wreck salvage quiz and an observation will land here.
            </p>
          ) : (
            observations.map((obs) => (
              <div
                key={obs.id}
                className="border-b border-stone-100 p-4 last:border-b-0"
              >
                <p className="text-sm font-medium text-stone-900">{obs.standardCode}</p>
                <p className="mt-0.5 text-xs text-stone-600">{obs.description}</p>
                <p className="mt-1 text-xs text-stone-500">
                  {obs.evidenceTier} · {obs.sourceType}
                  {obs.correctness != null
                    ? ` · ${Math.round(obs.correctness * 100)}%`
                    : ""}
                  {obs.notes ? ` · ${obs.notes}` : ""}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
          By Subject
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {subjects.map((subject) => (
            <Link
              key={subject.slug}
              href={`/progress/${subject.slug}`}
              className="rounded-xl border border-stone-200 bg-white p-4 hover:border-amber-300"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-stone-900">{subject.name}</h3>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                  {subject.mastery} mastery
                </span>
              </div>
              <p className="mt-2 text-sm text-stone-600">
                {subject.progressedCount}/{subject.standardsCount} standards observed
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
          Top Skills
        </h2>
        <div className="rounded-xl border border-stone-200 bg-white">
          {topSkills.length === 0 && (
            <p className="p-4 text-sm text-stone-600">
              Skills will appear here as standards evidence accumulates.
            </p>
          )}
          {topSkills.map((skill) => (
            <div
              key={skill.slug}
              className="flex items-center justify-between border-b border-stone-100 p-4 last:border-b-0"
            >
              <div>
                <p className="text-sm font-medium text-stone-900">{skill.name}</p>
                <p className="text-xs text-stone-500">{skill.evidenceCount} evidence events</p>
              </div>
              <span className="text-sm font-semibold text-stone-700">{skill.mastery}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import { requireChildPage } from "../../lib/auth/pageGuards";
import { getSagaProgress } from "../../lib/services/missions";
import { SUBJECT_DISPLAY_NAMES } from "../../lib/constants/subjects";
import type { Grade3SubjectSlug } from "../../lib/constants/subjects";

function subjectLabel(slug: string): string {
  return SUBJECT_DISPLAY_NAMES[slug as Grade3SubjectSlug] ?? slug;
}

export default async function SagaPage() {
  const { profile } = await requireChildPage();

  const saga = await getSagaProgress(profile.id);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">
            {saga.worldTitle}
          </p>
          <h1 className="text-2xl font-semibold text-stone-900">{saga.arcTitle}</h1>
          <p className="mt-2 text-sm text-stone-600">
            Unit 1 is wreck + food. Later units stay planned until this loop is playable.
          </p>
        </div>
        <div className="flex gap-3 text-sm">
          <Link href="/learn" className="font-medium text-amber-800 hover:underline">
            Back to beach
          </Link>
          <Link href="/progress" className="text-stone-600 hover:underline">
            Progress
          </Link>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
          Chapters
        </h2>
        <ol className="space-y-2">
          {saga.chapters.map((ch) => (
            <li
              key={ch.id}
              className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-stone-900">
                  {ch.orderIndex + 1}. {ch.title}
                </p>
              </div>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-800">
                {ch.status.toLowerCase()}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
          Tonight’s jobs
        </h2>
        <div className="space-y-2">
          {saga.missions.map((m) => (
            <article
              key={m.id}
              className="rounded-xl border border-stone-200 bg-white px-4 py-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-800/80">
                    {m.pinId} · {subjectLabel(m.subjectSlug)}
                  </p>
                  <h3 className="text-sm font-semibold text-stone-900">{m.title}</h3>
                  <p className="text-xs text-stone-600">
                    {m.theme} · ~{m.estimatedMinutes} min · {m.rewards.xp} XP ·{" "}
                    {m.rewards.mapPin}
                  </p>
                </div>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-stone-700">
                  {m.status}
                </span>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-3 text-xs text-stone-500">
          Wreck salvage: {saga.wreckQuizDone ? "done" : "open"} · Crew log:{" "}
          {saga.chapter1ReflectionDone ? "written" : "optional / not yet"}
        </p>
      </section>
    </main>
  );
}

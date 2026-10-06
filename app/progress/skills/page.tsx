import Link from "next/link";
import { requireChildPage } from "../../../lib/auth/pageGuards";
import { getSkillProgressOverview } from "../../../lib/services/progress";
import { EVIDENCE_EXPLANATION, masteryEstimate } from "../../../lib/play/progressCopy";

export default async function SkillsProgressPage() {
  const { profile } = await requireChildPage();

  const skills = await getSkillProgressOverview(profile.id);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Link href="/progress" className="text-sm text-amber-700 hover:underline">
        Back to Progress
      </Link>
      <h1 className="mt-3 text-2xl font-semibold text-stone-900">Skills</h1>
      <p className="mt-2 text-sm text-stone-600">
        {EVIDENCE_EXPLANATION}
      </p>

      <div className="mt-8 divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white">
        {skills.length === 0 && (
          <p className="p-4 text-sm text-stone-600">
            Skill progress appears after observations are recorded in sessions.
          </p>
        )}
        {skills.map((skill) => (
          <div key={skill.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-stone-900">{skill.name}</p>
              <p className="text-xs text-stone-500">
                {skill.evidenceCount} recorded observations
                {skill.subjectScope ? ` · ${skill.subjectScope}` : ""}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
              {masteryEstimate(skill.mastery, skill.evidenceCount)}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}

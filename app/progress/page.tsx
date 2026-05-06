import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth/session";
import { getProfile } from "../../lib/services/profile";
import { getSkillProgressOverview, getSubjectProgressOverview } from "../../lib/services/progress";

export default async function ProgressPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getProfile(user.userId);
  if (!profile) redirect("/onboarding");

  const [subjects, skills] = await Promise.all([
    getSubjectProgressOverview(profile.id),
    getSkillProgressOverview(profile.id),
  ]);
  const topSkills = skills.slice(0, 8);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-stone-900">Your Progress</h1>
      <p className="mt-2 text-sm text-stone-600">
        Explore growth by subject standards and cross-subject skills.
      </p>

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

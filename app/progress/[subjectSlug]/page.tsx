import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "../../../lib/auth/session";
import { getProfile } from "../../../lib/services/profile";
import { getSubjectStandardsProgress } from "../../../lib/services/progress";

interface PageProps {
  params: Promise<{ subjectSlug: string }>;
}

export default async function SubjectProgressPage({ params }: PageProps) {
  const { subjectSlug } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getProfile(user.userId);
  if (!profile) redirect("/onboarding");

  const data = await getSubjectStandardsProgress(profile.id, subjectSlug);
  if (!data) notFound();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Link href="/progress" className="text-sm text-amber-700 hover:underline">
        Back to Progress
      </Link>
      <h1 className="mt-3 text-2xl font-semibold text-stone-900">{data.subject.name}</h1>
      <p className="mt-1 text-sm text-stone-600">
        Standards map with evidence-driven mastery scores.
      </p>

      <div className="mt-8 space-y-5">
        {data.strands.map((strand) => (
          <section key={strand.code} className="rounded-xl border border-stone-200 bg-white p-4">
            <h2 className="text-base font-semibold text-stone-900">
              {strand.code} · {strand.name}
            </h2>
            <div className="mt-3 space-y-4">
              {strand.groups.map((group) => (
                <div key={group.code}>
                  <h3 className="text-sm font-medium text-stone-800">
                    {group.code} · {group.name}
                  </h3>
                  <div className="mt-2 space-y-2">
                    {group.standards.map((standard) => (
                      <div
                        key={standard.code}
                        className="flex items-center justify-between rounded-lg border border-stone-100 p-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-stone-900">
                            {standard.code}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-stone-600">
                            {standard.description}
                          </p>
                        </div>
                        <div className="ml-3 text-right">
                          <p className="text-sm font-semibold text-stone-800">{standard.mastery}</p>
                          <p className="text-xs text-stone-500">{standard.evidenceCount} evidence</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

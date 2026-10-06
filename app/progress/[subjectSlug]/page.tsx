import Link from "next/link";
import { notFound } from "next/navigation";
import { requireChildPage } from "../../../lib/auth/pageGuards";
import { getSubjectStandardsProgress } from "../../../lib/services/progress";
import { EVIDENCE_EXPLANATION, masteryEstimate } from "../../../lib/play/progressCopy";

interface PageProps {
  params: Promise<{ subjectSlug: string }>;
}

export default async function SubjectProgressPage({ params }: PageProps) {
  const { subjectSlug } = await params;
  const { profile } = await requireChildPage();

  const data = await getSubjectStandardsProgress(profile.id, subjectSlug);
  if (!data) notFound();

  type FlatStd = {
    code: string;
    description: string;
    mastery: number;
    confidence: number;
    evidenceCount: number;
    lastObservedAt: Date | null;
    nextReviewAt: Date | null;
  };
  const flat: FlatStd[] = data.strands.flatMap((strand) =>
    strand.groups.flatMap((group) =>
      group.standards.map((s) => ({
        code: s.code,
        description: s.description,
        mastery: s.mastery,
        confidence: s.confidence,
        evidenceCount: s.evidenceCount,
        lastObservedAt: s.lastObservedAt,
        nextReviewAt: s.nextReviewAt,
      }))
    )
  );
  const withEvidence = flat.filter((s) => s.evidenceCount > 0);
  const growingEdges = [...withEvidence]
    .sort((a, b) => a.mastery - b.mastery || b.evidenceCount - a.evidenceCount)
    .slice(0, 5);
  const recentTouches = [...withEvidence]
    .filter((s) => s.lastObservedAt)
    .sort(
      (a, b) =>
        (b.lastObservedAt?.getTime() ?? 0) - (a.lastObservedAt?.getTime() ?? 0)
    )
    .slice(0, 5);
  const dueSoon = [...withEvidence]
    .filter((s) => s.nextReviewAt && s.nextReviewAt.getTime() <= Date.now() + 1000 * 60 * 60 * 72)
    .sort((a, b) => (a.nextReviewAt?.getTime() ?? 0) - (b.nextReviewAt?.getTime() ?? 0))
    .slice(0, 5);
  const notYetSeen = flat
    .filter((s) => s.evidenceCount === 0)
    .slice(0, 6);

  const fmtShort = (d: Date) =>
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" });

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Link href="/progress" className="text-sm text-amber-700 hover:underline">
        Back to Progress
      </Link>
      <h1 className="mt-3 text-2xl font-semibold text-stone-900">{data.subject.name}</h1>
      <p className="mt-1 text-sm text-stone-600">
        {EVIDENCE_EXPLANATION}
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <InsightCard
          title="Growing edges"
          subtitle="Skills that may benefit from more practice"
          empty="Try a learning activity to find a useful starting point."
          items={growingEdges.map((s) => ({
            label: s.code,
            detail: `${masteryEstimate(s.mastery, s.evidenceCount)} · ${s.evidenceCount} observations`,
          }))}
        />
        <InsightCard
          title="Recently practiced"
          subtitle="Standards touched most recently"
          empty="Recent work will appear after a learning activity."
          items={recentTouches.map((s) => ({
            label: s.code,
            detail: `${masteryEstimate(s.mastery, s.evidenceCount)} · ${s.lastObservedAt ? fmtShort(s.lastObservedAt) : "—"}`,
          }))}
        />
        <InsightCard
          title="Recommended soon"
          subtitle="Review windows within ~3 days"
          empty="No review is suggested yet."
          items={dueSoon.map((s) => ({
            label: s.code,
            detail: `${masteryEstimate(s.mastery, s.evidenceCount)} · try again ${s.nextReviewAt ? fmtShort(s.nextReviewAt) : "soon"}`,
          }))}
        />
        <InsightCard
          title="Not observed yet"
          subtitle="Sampling of untouched standards"
          empty="Every skill here has at least one observation."
          items={notYetSeen.map((s) => ({
            label: s.code,
            detail: "No evidence yet",
          }))}
        />
      </div>

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
                          <p className="mt-0.5 text-xs leading-relaxed text-stone-600">
                            {standard.description}
                          </p>
                        </div>
                        <div className="ml-3 text-right">
                          <p className="text-sm font-semibold text-stone-800">{masteryEstimate(standard.mastery, standard.evidenceCount)}</p>
                          <p className="text-xs text-stone-500">{standard.evidenceCount} observations</p>
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

function InsightCard(props: {
  title: string;
  subtitle: string;
  empty: string;
  items: { label: string; detail: string }[];
}) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-stone-900">{props.title}</h2>
      <p className="mt-0.5 text-xs text-stone-500">{props.subtitle}</p>
      {props.items.length === 0 ? (
        <p className="mt-3 text-xs text-stone-500">{props.empty}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {props.items.map((row) => (
            <li key={row.label} className="text-xs">
              <span className="font-medium text-stone-800">{row.label}</span>
              <span className="text-stone-500"> — {row.detail}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

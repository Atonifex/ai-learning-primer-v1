import Link from "next/link";
import { notFound } from "next/navigation";
import { requireParentPage } from "../../../lib/auth/pageGuards";
import { getParentDashboard, parseUsagePeriod } from "../../../lib/services/parentDashboard";
import { captainDisplayName } from "../../../lib/profile/captainName";
import { formatHiddenMinutes } from "../../../lib/services/timeMath";
import { CURRICULUM_COVERAGE, EVIDENCE_EXPLANATION, evidenceLabel, masteryEstimate } from "../../../lib/play/progressCopy";

export default async function ParentProgressPage({ searchParams }: {
  searchParams: Promise<{ captain?: string; period?: string; subject?: string }>;
}) {
  const parent = await requireParentPage();
  const query = await searchParams;
  const period = parseUsagePeriod(query.period);
  const { captains, report, invalidSelection } = await getParentDashboard(parent.userId, typeof query.captain === "string" ? query.captain : undefined, period);
  if (invalidSelection) notFound();
  const url = (captain: string, nextPeriod = period, subject?: string) => `/household/progress?${new URLSearchParams({ captain, period: nextPeriod, ...(subject ? { subject } : {}) })}`;
  const shownSubjects = report?.subjects.filter((s) => !query.subject || s.subject.slug === query.subject) ?? [];
  const observed = report?.subjects.flatMap((s) => s.standards).filter((s) => s.evidenceCount > 0).length ?? 0;
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-8 text-stone-900">
      <Link href="/household" className="inline-block min-h-11 py-3 text-sm font-medium text-teal-900 underline">Back to household and handoff</Link>
      <h1 className="mt-3 text-3xl font-semibold">Student usage and progress</h1>
      <p className="mt-2 text-sm text-stone-600">Recorded usage and learning evidence for students in your household.</p>
      {!report ? <section className="mt-8 rounded-2xl border border-stone-200 p-6"><h2 className="text-lg font-semibold">Add your first student</h2><p className="mt-2 text-sm">Create a captain in your household. Usage and standards evidence will appear here as they learn.</p><Link href="/household" className="mt-3 inline-block min-h-11 py-3 font-medium text-teal-900 underline">Set up a captain</Link></section> : <>
        <nav aria-label="Choose student" className="mt-6 flex flex-wrap gap-2">
          {captains.map((c) => <Link key={c.userId} href={url(c.userId)} aria-current={c.userId === report.captain.userId ? "page" : undefined} className={`min-h-11 rounded-xl border px-4 py-3 text-sm ${c.userId === report.captain.userId ? "border-teal-800 bg-teal-900 text-white" : "border-stone-300 bg-white"}`}>{captainDisplayName(c.displayName, c.username)} · {c.username}</Link>)}
        </nav>
        <h2 className="mt-6 text-xl font-semibold">{captainDisplayName(report.captain.displayName, report.captain.username)} · Grade {report.captain.gradeBand}</h2>
        <nav aria-label="Usage period" className="mt-3 flex flex-wrap gap-2">
          {(["7", "30", "all"] as const).map((p) => <Link key={p} href={url(report.captain.userId, p, query.subject)} aria-current={period === p ? "page" : undefined} className={`min-h-11 rounded-lg border px-4 py-3 text-sm ${period === p ? "border-teal-800 bg-teal-50" : "border-stone-200"}`}>{p === "all" ? "All recorded time" : `Last ${p} days`}</Link>)}
        </nav>
        <section aria-label="Recorded usage" className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Recorded session time", report.usage.sessionSeconds === 0 ? "0 minutes" : formatHiddenMinutes(report.usage.sessionSeconds)],
            ["Sessions started", String(report.usage.sessionCount)],
            ["Completed activity attempts", String(report.usage.activityCount)],
            ["Recorded activity time", report.usage.activitySeconds === 0 ? "0 minutes" : formatHiddenMinutes(report.usage.activitySeconds)],
          ].map(([label, value]) => <div key={label} className="rounded-2xl border border-stone-200 bg-white p-5"><h3 className="text-sm text-stone-600">{label}</h3><p className="mt-2 text-2xl font-semibold">{value}</p></div>)}
        </section>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">Usage periods count sessions started and activities completed in that period. Time comes from closed session/activity records and may include breaks. Session and activity times can overlap; don’t add them together. They do not measure attention or learning. {report.usage.openSessionCount > 0 ? `${report.usage.openSessionCount} open session(s) have no completed session time yet.` : ""}</p>
        <p className="mt-2 text-sm text-stone-600">Latest recorded session start: {report.usage.latestSessionStart ? report.usage.latestSessionStart.toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" }) + " Eastern" : "No sessions in this period"}. A saved session can span multiple visits.</p>
        <details className="mt-4 rounded-xl border border-stone-200 p-4">
          <summary className="min-h-11 cursor-pointer py-3 font-medium text-teal-900">Usage by day</summary>
          <p className="text-sm text-stone-600">Dates are Eastern time. Session time is assigned to its start date; activity time to its completion date. These are recorded clocks, not an active-minute breakdown.</p>
          {report.usage.days.length === 0 ? <p className="mt-3 text-sm">No usage records in this period yet.</p> : <div className="mt-3 overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">Daily recorded session and activity usage</caption><thead><tr>{["Date", "Sessions started", "Session time", "Completed attempts", "Activity time"].map((label) => <th key={label} scope="col" className="whitespace-nowrap border-b p-3">{label}</th>)}</tr></thead><tbody>{report.usage.days.map((day) => <tr key={day.date}><th scope="row" className="whitespace-nowrap border-b p-3 font-medium">{day.date}</th><td className="border-b p-3">{day.sessions}</td><td className="border-b p-3">{day.sessionSeconds ? formatHiddenMinutes(day.sessionSeconds) : "0 minutes"}</td><td className="border-b p-3">{day.activities}</td><td className="border-b p-3">{day.activitySeconds ? formatHiddenMinutes(day.activitySeconds) : "0 minutes"}</td></tr>)}</tbody></table></div>}
        </details>
        <section aria-label="Standards progress" className="mt-8">
          <h2 className="text-xl font-semibold">Standards progress</h2>
          <p className="mt-2 text-sm text-stone-600">{observed} standards with recorded observations. Standards progress is cumulative; the usage period above does not change it. {EVIDENCE_EXPLANATION}</p>
          <p className="mt-3 rounded-xl bg-amber-50 p-4 text-sm leading-relaxed">{CURRICULUM_COVERAGE}</p>
          <nav aria-label="Filter standards by subject" className="mt-4 flex flex-wrap gap-2">
            <Link href={url(report.captain.userId, period)} aria-current={!query.subject ? "page" : undefined} className="min-h-11 rounded-lg border border-stone-300 px-4 py-3 text-sm">All subjects</Link>
            {report.subjects.map((s) => <Link key={s.subject.slug} href={url(report.captain.userId, period, s.subject.slug)} aria-current={query.subject === s.subject.slug ? "page" : undefined} className="min-h-11 rounded-lg border border-stone-300 px-4 py-3 text-sm">{s.subject.name}</Link>)}
          </nav>
          {shownSubjects.length === 0 && <p className="mt-4 text-sm">No enrolled subject matches this filter. Choose All subjects.</p>}
          {shownSubjects.map((s) => <section key={s.subject.slug} className="mt-5 rounded-2xl border border-stone-200 p-4">
            <h3 className="text-lg font-semibold">{s.subject.name}</h3>
            <p className="mt-1 text-sm text-stone-600">{s.standards.filter((standard) => standard.evidenceCount > 0).length} of {s.standards.length} catalog standards observed. Catalog availability does not mean every lesson has been authored.</p>
            <details className="mt-3"><summary className="min-h-11 cursor-pointer py-3 font-medium text-teal-900">View standards and evidence estimates</summary>
              <ul className="divide-y divide-stone-200">{s.standards.map((standard) => <li key={standard.code} className="py-4">
                <p className="font-medium">{standard.code}</p><p className="mt-1 text-sm leading-relaxed">{standard.description}</p>
                <p className="mt-2 text-sm text-teal-900">{masteryEstimate(standard.mastery, standard.evidenceCount)} · {standard.evidenceCount} observation(s)</p>
                {standard.evidenceCount > 0 && <p className="mt-1 text-xs text-stone-600">Last observed: {standard.lastObservedAt?.toLocaleDateString("en-US", { timeZone: "America/New_York" }) ?? "Not recorded"}. Estimate confidence: {standard.confidence}%.</p>}
              </li>)}</ul>
            </details>
          </section>)}
        </section>
        <section aria-label="Recent learning evidence" className="mt-8 rounded-2xl border border-stone-200 p-5">
          <h2 className="text-xl font-semibold">Recent learning evidence</h2>
          <p className="mt-2 text-sm text-stone-600">Latest observations across all recorded time. A starting check can include help; a checkpoint label alone does not prove independent mastery.</p>
          {report.observations.length === 0 ? <p className="mt-4 text-sm">No learning observations yet. This means not assessed, rather than a score of zero.</p> : <ul className="mt-3 divide-y divide-stone-200">{report.observations.map((o) => <li key={o.id} className="py-4"><p className="font-medium">{o.standardCode}</p><p className="mt-1 text-sm">{o.description}</p><p className="mt-2 text-sm text-teal-900">{evidenceLabel(o.evidenceTier, o.sourceType)}</p><p className="mt-1 text-xs text-stone-600">{o.createdAt.toLocaleDateString("en-US", { timeZone: "America/New_York" })}{o.correctness != null ? ` · Recorded correctness: ${Math.round(o.correctness * 100)}%` : " · No correctness score recorded"}</p></li>)}</ul>}
        </section>
      </>}
    </main>
  );
}

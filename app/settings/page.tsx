import Link from "next/link";
import { requireChildPage } from "../../lib/auth/pageGuards";
import ReadingLevelForm from "../../components/settings/ReadingLevelForm";
import CaptainNameForm from "../../components/settings/CaptainNameForm";

export default async function SettingsPage() {
  const { profile } = await requireChildPage();

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8">
        <Link
          href="/progress"
          className="text-sm font-medium text-amber-700 hover:text-amber-900 hover:underline"
        >
          ← Back to progress
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-stone-900">Settings</h1>
        <p className="mt-2 text-sm text-stone-600">
          Choose your captain name and adjust how Rho talks to you.
        </p>
      </div>

      <CaptainNameForm initialName={profile.displayName} />
      <ReadingLevelForm
        gradeBand={profile.gradeBand}
        initialReadingLevel={profile.readingLevel}
        captainName={profile.displayName}
      />

      <section className="mt-8 rounded-xl border border-dashed border-stone-200 bg-stone-50/80 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Coming later
        </h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-stone-600">
          <li>Weekly parent report (dashboard, email, PDF)</li>
          <li>Automatic advance to Grade 4 standards after G3 checkpoints</li>
          <li>Placement quiz to set reading level without guessing</li>
        </ul>
      </section>
    </main>
  );
}

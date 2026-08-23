import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12 text-stone-800">
      <p className="text-sm text-stone-500">
        <Link href="/register" className="text-amber-700 hover:underline">
          Back
        </Link>
      </p>
      <h1 className="mt-4 text-2xl font-semibold">Privacy</h1>
      <p className="mt-4 text-sm leading-relaxed text-stone-600">
        Primer is a learning game for families. A parent or guardian creates the
        household. Each captain has a separate login (username + PIN). We do not
        collect a child’s email.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-stone-600">
        We store the captain’s name, grade, story progress, and learning evidence
        so Rho can teach and so a parent can later see Florida standards. If the
        captain uses the microphone, audio is transcribed and discarded — we keep
        the text, not the recording.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-stone-600">
        Checking the box at sign-up records that a parent agreed. That is the
        product shape for testers; it is not a claim of legal certification.
        Before taking stipend money, Primer will have a lawyer review COPPA and
        Florida student-privacy rules.
      </p>
    </main>
  );
}

"use client";
import Link from "next/link";
export default function ParentProgressError({ reset }: { reset: () => void }) {
  return <main className="mx-auto max-w-3xl p-8"><h1 className="text-2xl font-semibold">Could not load student progress</h1><p className="mt-3">Your student’s saved work is unchanged. Try loading the report again.</p><button type="button" onClick={reset} className="mt-4 min-h-11 rounded-lg bg-teal-900 px-5 py-3 text-white">Try again</button><Link href="/household" className="ml-4 inline-block min-h-11 py-3 underline">Back to household</Link></main>;
}

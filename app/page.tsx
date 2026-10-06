import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "../lib/auth/session";
import { PRIMER_INVITATION } from "../lib/productIdentity";

export default async function Home() {
  const user = await getCurrentUser();
  if (user?.role === "PARENT") redirect("/household");
  if (user) redirect("/learn");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#071820] px-6 py-12 text-amber-50">
      <div className="w-full max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">Primer</p>
        <h1 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
          Turn curiosity into capability.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-teal-100/90" data-testid="primer-invitation">
          {PRIMER_INVITATION}
        </p>
        <section aria-label="Your student's first session" className="mt-7 rounded-2xl border border-teal-200/20 p-5">
          <h2 className="font-semibold text-amber-100">A clear place to start</h2>
          <p className="mt-2 text-sm leading-relaxed text-teal-100/90">Set up your student once. They meet Rho, discover skills that help the crew, and try a starting check to find useful practice. You can follow their recorded usage and standards evidence from your parent dashboard.</p>
        </section>
        <div className="mt-9 flex flex-wrap gap-4">
          <Link href="/register" className="rounded-full bg-amber-200 px-6 py-3 font-semibold text-slate-950 hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200">
            Create a parent account
          </Link>
          <Link href="/login" className="rounded-full border border-teal-200/40 px-6 py-3 font-semibold hover:bg-teal-100/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-200">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}

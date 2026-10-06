"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [coppaConsent, setCoppaConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, coppaConsent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push("/household");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Primer</h1>
          <p className="mt-2 text-sm text-stone-500">
            Create your parent account, set up a student, then open their learning experience. Your student will use a separate login and PIN.
          </p>
        </div>
        <div className="rounded-2xl border border-stone-100 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-stone-900">Create a household</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="parent-email" className="mb-1.5 block text-sm font-medium text-stone-700">Parent email</label>
              <Input
                id="parent-email"
                autoComplete="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="parent-password" className="mb-1.5 block text-sm font-medium text-stone-700">
                Password <span className="font-normal text-stone-400">(min 8 characters)</span>
              </label>
              <Input
                id="parent-password"
                autoComplete="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={8}
                required
              />
            </div>
            <label className="flex items-start gap-2 text-sm text-stone-600">
              <input
                type="checkbox"
                className="mt-1"
                checked={coppaConsent}
                onChange={(e) => setCoppaConsent(e.target.checked)}
                required
              />
              <span>
                I am this child’s parent or guardian. I agree Primer may collect their
                captain name, learning activity, and voice transcripts (audio is deleted).{" "}
                <Link href="/privacy" className="text-amber-700 hover:underline">
                  Privacy
                </Link>
              </span>
            </label>
            {error && (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}
            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? "Creating household…" : "Continue"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-stone-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-amber-700 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

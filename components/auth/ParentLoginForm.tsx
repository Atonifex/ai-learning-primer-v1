"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function ParentLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign-in failed");
      router.push("/household");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="parent-login-email" className="mb-1.5 block text-sm font-medium text-stone-700">Parent email</label>
        <Input
          id="parent-login-email"
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
        <label htmlFor="parent-login-password" className="mb-1.5 block text-sm font-medium text-stone-700">Password</label>
        <Input
          id="parent-login-password"
          autoComplete="current-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Input from "../ui/Input";

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

export default function CaptainLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function addDigit(d: string) {
    setPin((p) => (p.length >= 4 ? p : p + d));
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/child-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not sign in");
      router.push("/learn");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
      setPin("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-stone-700">
          Captain login
        </label>
        <Input
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          placeholder="your student's name"
          required
          autoFocus
        />
      </div>
      <div>
        <p className="mb-1.5 text-sm font-medium text-stone-700">PIN</p>
        <p className="mb-3 font-mono text-2xl tracking-[0.4em] text-stone-800" aria-live="polite">
          {pin.padEnd(4, "•")}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {DIGITS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => addDigit(d)}
              className={`rounded-xl border border-stone-200 py-3 text-lg font-semibold text-stone-800 hover:bg-stone-50 ${
                d === "0" ? "col-start-2" : ""
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPin("")}
          className="mt-2 text-xs text-stone-500 hover:underline"
        >
          Clear PIN
        </button>
      </div>
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      <Button
        type="submit"
        disabled={loading || pin.length !== 4}
        className="w-full"
        size="lg"
      >
        {loading ? "Waking…" : "Wake on the beach"}
      </Button>
    </form>
  );
}

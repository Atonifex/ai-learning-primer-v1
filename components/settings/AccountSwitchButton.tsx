"use client";
import { useState } from "react";
import Button from "../ui/Button";
export default function AccountSwitchButton() {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function switchAccount() {
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Could not switch accounts. Try again.");
      window.location.assign("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not switch accounts. Try again.");
      setSaving(false);
    }
  }
  return <section className="mt-8 rounded-xl border border-stone-200 p-5">
    <h2 className="text-lg font-semibold">Switch accounts</h2>
    <p className="mt-2 text-sm text-stone-600">Sign out on this device to let a parent or another captain sign in. Your saved learning and current session stay with your account.</p>
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    <Button type="button" className="mt-4 min-h-11" disabled={saving} onClick={() => void switchAccount()}>{saving ? "Signing out…" : "Switch account"}</Button>
  </section>;
}

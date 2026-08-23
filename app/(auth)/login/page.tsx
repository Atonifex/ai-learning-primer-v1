"use client";

import { useState } from "react";
import Link from "next/link";
import ParentLoginForm from "../../../components/auth/ParentLoginForm";
import CaptainLoginForm from "../../../components/auth/CaptainLoginForm";

type Tab = "parent" | "captain";

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>("parent");

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Primer</h1>
          <p className="mt-2 text-sm text-stone-500">
            Parents sign in here. Captains use a login and PIN.
          </p>
        </div>
        <div className="rounded-2xl border border-stone-100 bg-white p-8 shadow-sm">
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-stone-100 p-1">
            <button
              type="button"
              onClick={() => setTab("parent")}
              className={`rounded-lg py-2 text-sm font-medium ${
                tab === "parent" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"
              }`}
            >
              Parent
            </button>
            <button
              type="button"
              onClick={() => setTab("captain")}
              className={`rounded-lg py-2 text-sm font-medium ${
                tab === "captain" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"
              }`}
            >
              Captain
            </button>
          </div>
          {tab === "parent" ? <ParentLoginForm /> : <CaptainLoginForm />}
          <p className="mt-6 text-center text-sm text-stone-500">
            New household?{" "}
            <Link href="/register" className="font-medium text-amber-700 hover:underline">
              Create a parent account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

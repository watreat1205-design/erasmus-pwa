// app/settings/page.tsx
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ensureI18n } from "@/i18n";

export default function SettingsPage() {
  useEffect(() => {
    ensureI18n();
  }, []);

  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.cookie = `i18nextLng=${lng}; path=/`;
  };

  return (
    <div className="relative min-h-screen overflow-y-auto">
      {/* 🌄 Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: "url(/templates/5.jpg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center top",
        }}
      />
      <div className="fixed inset-0 -z-10 bg-black/20" />

      {/* 📦 Content */}
      <div className="relative">
        <div className="mx-auto max-w-3xl px-6 py-10 text-white">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-semibold">Settings</h1>

            <Link
              href="/dashboard"
              className="rounded-md border border-white/40 bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
            >
              ← Back
            </Link>
          </div>

          <div className="rounded-xl bg-white/90 text-slate-900 p-6 shadow backdrop-blur-md">
            <h2 className="text-lg font-semibold mb-4">Language</h2>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {["en", "el", "it", "es", "ro", "hr"].map((lng) => (
                <button
                  key={lng}
                  onClick={() => changeLanguage(lng)}
                  className="rounded-md border px-4 py-2 text-sm hover:bg-slate-100"
                >
                  {lng.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

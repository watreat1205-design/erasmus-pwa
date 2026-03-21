// src/components/layout/GlobalHeader.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ensureI18n } from "@/i18n";

const LANGS = [
  { code: "en", label: "EN", emoji: "🇬🇧" },
  { code: "el", label: "EL", emoji: "🇬🇷" },
  { code: "it", label: "IT", emoji: "🇮🇹" },
  { code: "es", label: "ES", emoji: "🇪🇸" },
  { code: "ro", label: "RO", emoji: "🇷🇴" },
  { code: "hr", label: "HR", emoji: "🇭🇷" },
];

export default function GlobalHeader() {
  const pathname = usePathname();
  const { t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    ensureI18n();
  }, []);

  const noChrome =
    pathname === "/welcome" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/reset-password");

  if (noChrome) {
    return null;
  }

  async function changeLang(lang: string) {
    document.cookie = `i18nextLng=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    localStorage.setItem("i18nextLng", lang);

    const instance = await ensureI18n();
    await instance.changeLanguage(lang);

    window.location.reload();
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-50 px-2 pt-2 sm:px-4 sm:pt-0">
      <div className="mx-auto max-w-6xl rounded-[24px] border border-white/20 bg-white/12 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:rounded-[28px] sm:p-3">
        <div className="rounded-2xl bg-white px-3 py-3 sm:px-5 sm:py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex items-start justify-between gap-3 sm:items-center sm:justify-start">
              <Link href="/dashboard" className="min-w-0 flex items-center gap-3">
                <Image
                  src="/brand/drops-logo.png"
                  alt="DROPS"
                  width={120}
                  height={120}
                  className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
                />
                <div className="min-w-0 leading-tight">
                  <div className="truncate text-xs text-gray-500 sm:text-sm">
                    {mounted
                      ? t("brand.tagline", {
                          defaultValue: "E-learning platform",
                        })
                      : "E-learning platform"}
                  </div>
                </div>
              </Link>

              <div className="ml-2 flex shrink-0 items-center gap-1 sm:ml-0">
                {LANGS.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => void changeLang(lang.code)}
                    className="text-sm font-medium leading-none text-gray-700 hover:text-black"
                    aria-label={lang.label}
                    title={lang.label}
                  >
                    {lang.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
              <Link
                href="/dashboard"
                className="flex min-h-[44px] items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-700 sm:px-4"
              >
                {mounted
                  ? t("buttons.goToDashboard", {
                      defaultValue: "Go to Dashboard",
                    })
                  : "Go to Dashboard"}
              </Link>

              <Link
                href="/welcome"
                className="flex min-h-[44px] items-center justify-center rounded-lg bg-black px-3 py-2 text-center text-sm font-semibold !text-white hover:bg-gray-800 sm:px-4"
              >
                {mounted
                  ? t("nav.welcomePage", { defaultValue: "Welcome page" })
                  : "Welcome page"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

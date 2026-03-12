"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ensureI18n } from "@/i18n";
import { createClient } from "@/lib/supabase/client";

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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
    ensureI18n();

    const supabase = createClient();

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setIsLoggedIn(!!user);
    }

    void loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
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
    <div className="fixed left-0 right-0 top-0 z-50 px-4 pt-0">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-white/20 bg-white/12 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white px-5 py-3">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image
              src="/brand/drops-logo.png"
              alt="DROPS"
              width={120}
              height={120}
              className="h-10 w-10 object-contain"
            />
            <div className="leading-tight">
              <div className="text-xs text-gray-500">
                {mounted
                  ? t("brand.tagline", { defaultValue: "E-learning platform" })
                  : "E-learning platform"}
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              {mounted
                ? t("buttons.goToDashboard", { defaultValue: "Dashboard" })
                : "Dashboard"}
            </Link>

            <Link
              href="/welcome"
              className="rounded-lg bg-black px-4 py-2 text-sm font-semibold !text-white hover:bg-gray-800"
            >
              {mounted
                ? t("nav.welcomePage", { defaultValue: "Welcome" })
                : "Welcome"}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {LANGS.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => void changeLang(lang.code)}
                  className="text-sm font-medium text-gray-700 hover:text-black"
                >
                  {lang.emoji}
                </button>
              ))}
            </div>

            {isLoggedIn ? (
              <Link
                href="/logout"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                {mounted
                  ? t("nav.logout", { defaultValue: "Logout" })
                  : "Logout"}
              </Link>
            ) : (
              <Link
                href={`/login?next=${encodeURIComponent(pathname)}`}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                {mounted
                  ? t("nav.login", { defaultValue: "Login" })
                  : "Login"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

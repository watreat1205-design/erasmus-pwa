// app/welcome/WelcomeClient.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { ensureI18n } from "../../src/i18n";

export type WelcomeClientProps = {
  loggedIn: boolean;
  displayName: string | null;
  initialLang: string;
};

const LANGS = [
  { code: "en", label: "EN", emoji: "🇬🇧" },
  { code: "el", label: "EL", emoji: "🇬🇷" },
  { code: "it", label: "IT", emoji: "🇮🇹" },
  { code: "es", label: "ES", emoji: "🇪🇸" },
  { code: "ro", label: "RO", emoji: "🇷🇴" },
  { code: "hr", label: "HR", emoji: "🇭🇷" },
];

export default function WelcomeClient({
  loggedIn,
  displayName,
  initialLang,
}: WelcomeClientProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation("common");

  useEffect(() => {
    ensureI18n();
  }, []);

  function changeLang(lang: string) {
    try {
      document.cookie = `i18nextLng=${lang}; path=/; max-age=31536000; SameSite=Lax`;

      if (i18n && typeof i18n.changeLanguage === "function") {
        void i18n.changeLanguage(lang);
        router.refresh();
        return;
      }

      window.location.reload();
    } catch {
      window.location.reload();
    }
  }

  return (
    <>
      <header className="flex items-center justify-between py-7 sm:py-8">
        <Link
          href="/welcome"
          prefetch={false}
          className="flex items-center gap-3 rounded-xl px-2 py-2"
        >
          <Image
            src="/brand/drops-logo.png"
            alt="DROPS logo"
            width={96}
            height={96}
            className="h-20 w-20 object-contain sm:h-24 sm:w-24"
          />
          <div className="leading-tight">
            <div className="text-base font-semibold text-white sm:text-lg">
              {t("brand.name", { defaultValue: "DROPS" })}
            </div>
            <div className="text-sm text-white">
              {t("brand.tagline", { defaultValue: "e-learning platform" })}
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-5">
          <div className="hidden items-center gap-1 sm:flex">
            {LANGS.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => changeLang(lang.code)}
                className="rounded-lg px-2.5 py-1.5 text-sm font-medium !text-white hover:bg-white/10"
                aria-label={lang.label}
                title={lang.label}
              >
                <span className="mr-1">{lang.emoji}</span>
                {lang.label}
              </button>
            ))}
          </div>

          {!loggedIn ? (
            <>
              <Link
                href="/signup"
                prefetch={false}
                className="hidden rounded-xl border border-gray-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-white sm:inline-flex"
              >
                {t("nav.register", { defaultValue: "Register" })}
              </Link>

              <Link
                href="/login"
                prefetch={false}
                className="inline-flex rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 sm:text-base"
              >
                {t("nav.login", { defaultValue: "Login" })}
              </Link>
            </>
          ) : (
            <Link
              href="/logout"
              prefetch={false}
              className="inline-flex rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 sm:text-base"
            >
              {t("nav.logout", { defaultValue: "Logout" })}
            </Link>
          )}
        </nav>
      </header>

      <main className="flex flex-1 items-center">
        <section className="w-full">
          <div className="max-w-2xl animate-[fadeUp_.35s_ease-out]">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white/80 drop-shadow-sm sm:text-5xl">
              {t("welcome.title", { defaultValue: "Welcome" })}
            </h1>

            <p className="mt-4 text-base font-medium leading-7 text-white/90 sm:text-lg">
              {t("welcome.subtitle", {
                defaultValue: "Digital learning platform for trainers and educators.",
              })}
            </p>

            {loggedIn ? (
              <p className="mt-4 text-sm font-medium text-white/90">
                {displayName
                  ? t("welcome.backWithName", {
                      name: displayName,
                      defaultValue: `Welcome back, ${displayName}`,
                    })
                  : t("welcome.back", { defaultValue: "Welcome back" })}
              </p>
            ) : null}

            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <Link
                href={loggedIn ? "/courses" : "/login?next=/courses"}
                prefetch={false}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 sm:w-auto"
              >
                {t("buttons.goToCourses", { defaultValue: "Go to Courses" })}
              </Link>

              <Link
                href={loggedIn ? "/dashboard" : "/login?next=/dashboard"}
                prefetch={false}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 sm:w-auto"
              >
                {t("buttons.goToDashboard", { defaultValue: "Go to Dashboard" })}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

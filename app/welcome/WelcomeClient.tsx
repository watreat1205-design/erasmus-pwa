// app/welcome/WelcomeClient.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { ensureI18n } from "../../src/i18n";

export type WelcomeClientProps = {
  loggedIn: boolean;
  displayName: string | null;
  initialLang: string;
  inviteToken?: string | null;
  inviteMeta?: unknown;
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
  inviteToken: _inviteToken,
  inviteMeta: _inviteMeta,
}: WelcomeClientProps) {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    async function init() {
      const instance = await ensureI18n();
      if (initialLang && instance.language !== initialLang) {
        await instance.changeLanguage(initialLang);
      }
    }

    void init();
  }, [initialLang]);

  async function changeLang(lang: string) {
    try {
      document.cookie = `i18nextLng=${lang}; path=/; max-age=31536000; SameSite=Lax`;
      localStorage.setItem("i18nextLng", lang);

      const instance = await ensureI18n();
      await instance.changeLanguage(lang);

      router.refresh();
    } catch {
      window.location.reload();
    }
  }

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-2 py-0.5 sm:py-1">
        <Link
          href="/welcome"
          prefetch={false}
          className="flex items-center gap-3 rounded-xl px-2 py-1"
        >
          <Image
            src="/brand/drops-logo1.png"
            alt="DROPS logo"
            width={160}
            height={160}
            className="h-20 w-20 object-contain sm:h-28 sm:w-28"
          />
          <div className="leading-tight">
            <div className="text-sm text-white sm:text-base">
              {mounted
                ? t("brand.tagline", { defaultValue: "e-learning platform" })
                : "e-learning platform"}
            </div>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 sm:gap-5">
          <div className="flex flex-wrap items-center gap-1">
            {LANGS.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => void changeLang(lang.code)}
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
                {mounted
                  ? t("nav.register", { defaultValue: "Register" })
                  : "Register"}
              </Link>

              <Link
                href="/login"
                prefetch={false}
                className="inline-flex rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 sm:text-base"
              >
                {mounted ? t("nav.login", { defaultValue: "Login" }) : "Login"}
              </Link>
            </>
          ) : (
            <Link
              href="/logout"
              prefetch={false}
              className="inline-flex rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 sm:text-base"
            >
              {mounted ? t("nav.logout", { defaultValue: "Logout" }) : "Logout"}
            </Link>
          )}
        </nav>
      </header>

      <main className="flex items-start pt-2 pb-24 sm:pb-32">
        <section className="w-full pt-0">
          <div className="max-w-5xl animate-[fadeUp_.35s_ease-out]">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              {mounted
                ? t("welcome.title", {
                    defaultValue: "DROPS of Sustainable Development",
                  })
                : "DROPS of Sustainable Development"}
            </h1>

            <p className="mt-3 text-base font-semibold leading-7 text-white sm:text-lg">
              {mounted
                ? t("welcome.subtitle", {
                    defaultValue:
                      "Digital learning platform for trainers and educators.",
                  })
                : "Digital learning platform for trainers and educators."}
            </p>

            {loggedIn ? (
              <p className="mt-3 text-sm font-semibold text-white">
                {mounted
                  ? displayName
                    ? t("welcome.backWithName", {
                        name: displayName,
                        defaultValue: `Welcome back, ${displayName}`,
                      })
                    : t("welcome.back", { defaultValue: "Welcome back" })
                  : displayName
                    ? `Welcome back, ${displayName}`
                    : "Welcome back"}
              </p>
            ) : null}

            {/* Intro text without glass card */}
            <div className="mt-10 max-w-4xl">
              <p className="text-base font-bold leading-8 text-white sm:text-lg">
                {mounted
                  ? t("welcome.intro", {
                      defaultValue:
                        "Welcome to the DROPS of Sustainable Development e-learning platform. This learning space supports trainers, educators and NGO professionals in developing sustainability competences through innovative methodologies, environmental education, green skills and active citizenship. Through practical modules, activities and quizzes, participants are encouraged to connect knowledge with action and apply sustainable practices in education, work and community life.",
                    })
                  : "Welcome to the DROPS of Sustainable Development e-learning platform. This learning space supports trainers, educators and NGO professionals in developing sustainability competences through innovative methodologies, environmental education, green skills and active citizenship. Through practical modules, activities and quizzes, participants are encouraged to connect knowledge with action and apply sustainable practices in education, work and community life."}
              </p>
            </div>

            {/* Buttons with more space below */}
            <div className="mt-10 mb-16 flex flex-col gap-3 lg:flex-row lg:items-center sm:mb-24">
              <div className="grid gap-3 sm:flex sm:flex-wrap">
                <Link
                  href={loggedIn ? "/courses" : "/login?next=/courses"}
                  prefetch={false}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 sm:w-auto"
                >
                  {mounted
                    ? t("buttons.goToCourses", {
                        defaultValue: "Go to Courses",
                      })
                    : "Go to Courses"}
                </Link>

                <Link
                  href={loggedIn ? "/dashboard" : "/login?next=/dashboard"}
                  prefetch={false}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 sm:w-auto"
                >
                  {mounted
                    ? t("buttons.goToDashboard", {
                        defaultValue: "Go to Dashboard",
                      })
                    : "Go to Dashboard"}
                </Link>
              </div>

              <a
                href="https://drops-sustainability.eu/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 self-start rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 lg:ml-20 lg:self-auto xl:ml-24"
              >
                {mounted
                  ? t("buttons.visitProjectWebsite", {
                      defaultValue: "Visit Project Website",
                    })
                  : "Visit Project Website"}
                <span className="transition-transform hover:translate-x-1">
                  →
                </span>
              </a>
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

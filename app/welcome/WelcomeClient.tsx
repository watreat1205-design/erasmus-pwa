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
      <header className="flex flex-wrap items-center justify-between gap-3 py-7 sm:py-8">
        <Link
          href="/welcome"
          prefetch={false}
          className="flex items-center gap-3 rounded-xl px-2 py-2"
        >
          <Image
            src="/brand/drops-logo1.png"
            alt="DROPS logo"
            width={160}
            height={160}
            className="h-32 w-32 object-contain sm:h-40 sm:w-40"
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

      <main className="flex flex-1 items-center">
        <section className="w-full">
          <div className="max-w-2xl animate-[fadeUp_.35s_ease-out]">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white/80 drop-shadow-sm sm:text-5xl">
              {mounted ? t("welcome.title", { defaultValue: "Welcome" }) : "Welcome"}
            </h1>

            <p className="mt-4 text-base font-medium leading-7 text-white/90 sm:text-lg">
              {mounted
                ? t("welcome.subtitle", {
                    defaultValue:
                      "Digital learning platform for trainers and educators.",
                  })
                : "Digital learning platform for trainers and educators."}
            </p>

            {loggedIn ? (
              <p className="mt-4 text-sm font-medium text-white/90">
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

            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <Link
                href={loggedIn ? "/courses" : "/login?next=/courses"}
                prefetch={false}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 sm:w-auto"
              >
                {mounted
                  ? t("buttons.goToCourses", { defaultValue: "Go to Courses" })
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
          </div>
        </section>
      </main>
       {/* Partners */}
   <div className="mt-24 border-t border-white/20 pt-12 pb-16">
  <p className="mb-6 text-center text-sm text-white/80">
    Project partners
  </p>
     <div className="flex flex-wrap items-center justify-center gap-8 opacity-90">
  <Image src="/partners/acta.png" alt="ACTA" width={120} height={60} className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition" />
  <Image src="/partners/ccif.png" alt="CCIF Cyprus" width={120} height={60} className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition" />
  <Image src="/partners/petitpas.png" alt="Petit Pas" width={120} height={60} className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition" />
  <Image src="/partners/stpeuropa.png" alt="STP Europa" width={120} height={60} className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition" />
  <Image src="/partners/uzinaduzina.png" alt="Uzinaduzina" width={120} height={60} className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition" />
  <Image src="/partners/4elements.png" alt="4 Elements" width={120} height={60} className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition" />
</div>
</div>
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

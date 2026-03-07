// app/courses/CoursesHeaderClient.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ensureI18n } from "@/i18n";
import { createClient } from "@/lib/supabase/client";

export default function CoursesHeaderClient() {
  const supabase = createClient();
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    ensureI18n();
  }, []);

  const { t } = useTranslation("common");

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted) {
        setLoggedIn(!!session);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setLoggedIn(!!session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (loggedIn === null) {
    return (
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        <div className="inline-flex w-full items-center justify-center rounded-lg bg-white px-3 py-2 text-sm font-medium text-black sm:w-auto">
          ...
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
      {loggedIn ? (
        <>
          <Link
            href="/dashboard"
            prefetch={false}
            className="inline-flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-medium text-black hover:bg-gray-100 sm:w-auto"
          >
            {t("nav.dashboard")}
          </Link>

          <Link
            href="/welcome"
            prefetch={false}
            className="inline-flex w-full items-center justify-center rounded-lg bg-black px-4 py-3 text-sm font-medium !text-white hover:bg-gray-900 sm:w-auto"
          >
            {t("common.backToWelcome")}
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/login"
            prefetch={false}
            className="inline-flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-medium text-black hover:bg-gray-100 sm:w-auto"
          >
            {t("courses.trainerLogin")}
          </Link>

          <span className="inline-flex w-full items-center justify-center rounded-lg bg-black px-4 py-3 text-sm font-medium text-black sm:w-auto">
            &nbsp;
          </span>
        </>
      )}
    </div>
  );
}

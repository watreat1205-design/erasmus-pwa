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
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-black">
          ...
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {loggedIn ? (
        <>
          <Link
            href="/dashboard"
            prefetch={false}
            className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-black hover:bg-gray-100"
          >
            {t("nav.dashboard")}
          </Link>

          <Link
            href="/welcome"
            prefetch={false}
            className="rounded-lg bg-black px-3 py-2 text-sm font-medium !text-white hover:bg-gray-900"
          >
            {t("common.backToWelcome")}
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/login"
            prefetch={false}
            className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-black hover:bg-gray-100"
          >
            {t("courses.trainerLogin")}
          </Link>

          <span className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-black">
            &nbsp;
          </span>
        </>
      )}
    </div>
  );
}

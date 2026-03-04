"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ensureI18n } from "@/i18n";
import { createClient } from "@/lib/supabase/client";

export default function CoursesHeaderClient() {
  const supabase = createClient();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    ensureI18n();
  }, []);

  const { t } = useTranslation("common");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });
  }, [supabase]);

  return (
    <div className="flex items-center gap-3">
      {loggedIn ? (
        <>
          <Link
            href="/dashboard"
            className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-black hover:bg-gray-100"
          >
            {t("nav.dashboard")}
          </Link>
          <Link
            href="/welcome"
            className="rounded-lg bg-black px-3 py-2 text-sm font-medium !text-white hover:bg-gray-900"
          >
            {t("common.backToWelcome")}
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/login"
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

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ensureI18n } from "@/i18n";

export default function SupportPage() {
  useEffect(() => {
    ensureI18n();
  }, []);

  const { t } = useTranslation("common");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{t("support.title")}</h1>

      <p className="mt-4">{t("support.soon")}</p>

      <Link
        href="/dashboard"
        className="inline-block mt-6 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
      >
        ← {t("support.backToDashboard")}
      </Link>
    </div>
  );
}

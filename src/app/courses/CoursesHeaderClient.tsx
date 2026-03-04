"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function CoursesHeaderClient() {
  const { t } = useTranslation("common");

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/dashboard"
        className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
      >
        {t("dashboard.trainerPanel", { defaultValue: "Dashboard" })}
      </Link>

      <Link
        href="/welcome"
        className="inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
      >
        {t("common.backToWelcome", { defaultValue: "Back to welcome" })}
      </Link>
    </div>
  );
}

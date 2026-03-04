"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function CoursesPublicHeader() {
  // IMPORTANT: force loading the "common" namespace (your common.json file)
  const { t, ready } = useTranslation("common");

  // If translations aren't ready yet, show nothing (prevents raw keys flashing)
  if (!ready) return null;

  return (
    <>
      <div className="mb-4">
        <Link
          href="/welcome"
          className="inline-flex items-center text-sm font-medium text-white hover:underline"
        >
          ← {t("common.backToWelcome", { defaultValue: "Back to welcome" })}
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">
            {t("courses.title", { defaultValue: "Courses" })}
          </h1>
          <p className="mt-2 text-sm text-white/90">
            {t("courses.subtitle", { defaultValue: "Browse available courses." })}
          </p>
        </div>
      </div>
    </>
  );
}

// app/courses/CoursesPublicHeader.tsx
"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function CoursesPublicHeader() {
  const { t, ready } = useTranslation("common");

  if (!ready) return null;

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/welcome"
          prefetch={false}
          className="inline-flex items-center text-sm font-medium text-white hover:underline"
        >
          ← {t("common.backToWelcome", { defaultValue: "Back to welcome" })}
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-semibold text-white">
          {t("courses.title", { defaultValue: "Courses" })}
        </h1>
        <p className="mt-2 text-sm text-white/90">
          {t("courses.subtitle", { defaultValue: "Browse available courses." })}
        </p>
      </div>
    </div>
  );
}

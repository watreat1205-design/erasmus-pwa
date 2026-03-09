// app/courses/CoursesPublicHeader.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CoursesPublicHeader() {
  const { t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/welcome"
          prefetch={false}
          className="inline-flex items-center text-sm font-medium text-white hover:underline"
        >
          ←{" "}
          {mounted
            ? t("common.backToWelcome", { defaultValue: "Back to welcome" })
            : "Back to welcome"}
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-semibold text-white">
          {mounted
            ? t("courses.title", { defaultValue: "Courses" })
            : "Courses"}
        </h1>
        <p className="mt-2 text-sm text-white/90">
          {mounted
            ? t("courses.subtitle", {
                defaultValue: "Browse available courses.",
              })
            : "Browse available courses."}
        </p>
      </div>
    </div>
  );
}

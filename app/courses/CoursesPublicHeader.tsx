// app/courses/CoursesPublicHeader.tsx
"use client";

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

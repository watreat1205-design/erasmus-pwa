"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function AllCoursesButtonClient() {
  const { t } = useTranslation("common");

  return (
    <Link
      href="/courses"
      className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 sm:w-auto"
    >
      ← {t("courses.title", { defaultValue: "All Courses" })}
    </Link>
  );
}

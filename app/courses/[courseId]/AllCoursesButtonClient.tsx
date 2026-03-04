"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function AllCoursesButtonClient() {
  const { t } = useTranslation("common");

  return (
    <Link
      href="/courses"
      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
    >
      ← {t("courses.title", { defaultValue: "All Courses" })}
    </Link>
  );
}

"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function LessonHeaderClient({
  courseTitle,
  lessonTitle,
  moduleLine,
  courseHref,
  isCompleted,
}: {
  courseTitle: string;
  lessonTitle: string;
  moduleLine: string;
  courseHref: string;
  isCompleted: boolean;
}) {
  const { t } = useTranslation("common");

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm !text-white">{courseTitle}</div>
        <h1 className="text-2xl font-semibold !text-white">{lessonTitle}</h1>
        <div className="mt-1 text-sm !text-white">{moduleLine}</div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className={
            "rounded-md px-4 py-2 text-sm font-medium " +
            (isCompleted
              ? "border border-gray-300 bg-white text-gray-900"
              : "bg-gray-900 text-white")
          }
        >
          {isCompleted ? `✅ ${t("lesson.completed")}` : t("lesson.markComplete")}
        </div>

        <Link
          href={courseHref}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
        >
          ← {t("common.back")}
        </Link>
      </div>
    </div>
  );
}

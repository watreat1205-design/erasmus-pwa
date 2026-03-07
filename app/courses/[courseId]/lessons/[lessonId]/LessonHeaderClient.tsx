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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 max-w-3xl">
        <div className="text-sm !text-white">{courseTitle}</div>
        <h1 className="text-3xl font-semibold !text-white sm:text-2xl">
          {lessonTitle}
        </h1>
        <div className="mt-1 text-sm !text-white">{moduleLine}</div>
      </div>

      <div className="w-full sm:w-auto">
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div
            className={
              "inline-flex w-full items-center justify-center rounded-md px-4 py-3 text-sm font-medium sm:w-auto " +
              (isCompleted
                ? "border border-gray-300 bg-white text-gray-900"
                : "bg-gray-900 text-white")
            }
          >
            {isCompleted ? `✅ ${t("lesson.completed")}` : t("lesson.markComplete")}
          </div>

          <Link
            href={courseHref}
            className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 sm:w-auto"
          >
            ← {t("common.back")}
          </Link>
        </div>
      </div>
    </div>
  );
}

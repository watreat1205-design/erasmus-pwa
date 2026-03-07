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
    <div className="flex flex-col gap-4">
      {/* MOBILE: buttons first / DESKTOP: buttons right */}
      <div className="order-1 flex w-full justify-end">
        <div className="flex w-full gap-3 sm:w-auto">
          <div
            className={
              "inline-flex flex-1 items-center justify-center rounded-md px-4 py-3 text-sm font-medium sm:flex-none " +
              (isCompleted
                ? "border border-gray-300 bg-white text-gray-900"
                : "bg-gray-900 text-white")
            }
          >
            {isCompleted ? `✅ ${t("lesson.completed")}` : t("lesson.markComplete")}
          </div>

          <Link
            href={courseHref}
            className="inline-flex flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 sm:flex-none"
          >
            ← {t("common.back")}
          </Link>
        </div>
      </div>

      {/* Text block */}
      <div className="order-2 min-w-0 max-w-3xl">
        <div className="text-sm !text-white">{courseTitle}</div>
        <h1 className="text-3xl font-semibold leading-tight !text-white sm:text-4xl">
          {lessonTitle}
        </h1>
        <div className="mt-1 text-sm !text-white">{moduleLine}</div>
      </div>
    </div>
  );
}

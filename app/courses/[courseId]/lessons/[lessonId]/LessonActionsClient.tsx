"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { markLessonComplete, markLessonIncomplete } from "@/app/courses/actions";

export default function LessonActionsClient({
  courseId,
  lessonId,
  isCompleted,
}: {
  courseId: string;
  lessonId: string;
  isCompleted: boolean;
}) {
  const { t } = useTranslation("common");

  return (
    <div className="flex w-full gap-3 sm:w-auto">
      {isCompleted ? (
        <form action={markLessonIncomplete} className="flex-1 sm:flex-none">
          <input type="hidden" name="courseId" value={courseId} />
          <input type="hidden" name="lessonId" value={lessonId} />
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 sm:w-auto"
          >
            ✅ {t("lesson.completed")}
          </button>
        </form>
      ) : (
        <form action={markLessonComplete} className="flex-1 sm:flex-none">
          <input type="hidden" name="courseId" value={courseId} />
          <input type="hidden" name="lessonId" value={lessonId} />
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 sm:w-auto"
          >
            {t("lesson.markComplete")}
          </button>
        </form>
      )}

      <Link
        href={`/courses/${courseId}`}
        className="inline-flex flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 sm:flex-none sm:w-auto"
      >
        ← {t("common.back")}
      </Link>
    </div>
  );
}

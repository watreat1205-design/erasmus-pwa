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
    <div className="flex items-center gap-3">
      {isCompleted ? (
        <form action={markLessonIncomplete}>
          <input type="hidden" name="courseId" value={courseId} />
          <input type="hidden" name="lessonId" value={lessonId} />
          <button
            type="submit"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
          >
            ✅ {t("lesson.completed")}
          </button>
        </form>
      ) : (
        <form action={markLessonComplete}>
          <input type="hidden" name="courseId" value={courseId} />
          <input type="hidden" name="lessonId" value={lessonId} />
          <button
            type="submit"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            {t("lesson.markComplete")}
          </button>
        </form>
      )}

      <Link
        href={`/courses/${courseId}`}
        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
      >
        ← {t("common.back")}
      </Link>
    </div>
  );
}

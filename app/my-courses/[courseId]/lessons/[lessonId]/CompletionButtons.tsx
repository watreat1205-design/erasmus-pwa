"use client";

import { markLessonComplete, markLessonIncomplete } from "@/app/courses/actions";

export default function CompletionButtons({
  courseId,
  lessonId,
  isCompleted,
}: {
  courseId: string;
  lessonId: string;
  isCompleted: boolean;
}) {
  // hard guard (prevents "undefined" ever being posted)
  if (!courseId || !lessonId) return null;

  return (
    <div className="mt-4">
      {isCompleted ? (
        <form action={markLessonIncomplete}>
          <input type="hidden" name="courseId" value={courseId} />
          <input type="hidden" name="lessonId" value={lessonId} />
          <button
            type="submit"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
          >
            ✅ Completed (click to undo)
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
            Mark as completed
          </button>
        </form>
      )}
    </div>
  );
}

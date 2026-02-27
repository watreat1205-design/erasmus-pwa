"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function bulkSetCoursePublish(
  courseIds: string[],
  isPublished: boolean
) {
  if (!Array.isArray(courseIds) || courseIds.length === 0) {
    return { ok: false, error: "No courses selected." };
  }

  const supabase = await createSupabaseServerClient();

  // 1) Update courses
  const { error: courseErr } = await supabase
    .from("courses")
    .update({ is_published: isPublished })
    .in("id", courseIds);

  if (courseErr) return { ok: false, error: courseErr.message };

  // 2) IMPORTANT: when publishing courses, publish ALL lessons in those courses too
  if (isPublished) {
    // Assumes course_lessons has course_id column
    const { error: lessonErr } = await supabase
      .from("course_lessons")
      .update({ is_published: true })
      .in("course_id", courseIds);

    if (lessonErr) return { ok: false, error: lessonErr.message };
  }

  revalidatePath("/author/courses");
  return { ok: true };
}

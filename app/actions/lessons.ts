"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteLesson(lessonId: string) {
  const supabase = await createSupabaseServerClient();

  // 1. Find section_id
  const { data: lesson, error: lErr } = await supabase
    .from("course_lessons")
    .select("id, section_id")
    .eq("id", lessonId)
    .single();

  if (lErr || !lesson) {
    throw new Error("Lesson not found");
  }

  // 2. Find course_id (needed for revalidation)
  const { data: section, error: sErr } = await supabase
    .from("course_sections")
    .select("course_id")
    .eq("id", lesson.section_id)
    .single();

  if (sErr || !section) {
    throw new Error("Section not found");
  }

  // 3. Delete lesson
  const { error: dErr } = await supabase
    .from("course_lessons")
    .delete()
    .eq("id", lessonId);

  if (dErr) {
    throw dErr;
  }

  // 4. Refresh UI
  revalidatePath(`/admin/courses/${section.course_id}/edit`);
}

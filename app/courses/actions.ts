// app/courses/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function markLessonComplete(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const lessonId = String(formData.get("lessonId") ?? "");

  if (!courseId || !lessonId) throw new Error("Missing courseId/lessonId");

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser();

  if (uErr || !user) throw new Error("Not logged in");

  const { error } = await supabase
    .from("lesson_progress")
    .insert({ user_id: user.id, lesson_id: lessonId });

  if (error && !error.message.toLowerCase().includes("duplicate")) {
    throw error;
  }

  revalidatePath(`/courses/${courseId}`);
  revalidatePath(`/courses`);
  revalidatePath(`/courses/${courseId}/lessons/${lessonId}`);
}

export async function markLessonIncomplete(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const lessonId = String(formData.get("lessonId") ?? "");

  if (!courseId || !lessonId) throw new Error("Missing courseId/lessonId");

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser();

  if (uErr || !user) throw new Error("Not logged in");

  const { error } = await supabase
    .from("lesson_progress")
    .delete()
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId);

  if (error) throw error;

  revalidatePath(`/courses/${courseId}`);
  revalidatePath(`/courses`);
  revalidatePath(`/courses/${courseId}/lessons/${lessonId}`);
}

"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/getRole";

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

  // ignore duplicate insert
  if (error && !error.message.toLowerCase().includes("duplicate")) throw error;

  // ✅ refresh pages that show progress
  revalidatePath(`/courses/${courseId}`);
  revalidatePath(`/courses`);
  // (optional) if you also have a dedicated lesson route, keep this:
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
export async function enrollInCourse(courseId: string) {
  const supabase = await createSupabaseServerClient();

  const { data: { user }, error: uErr } = await supabase.auth.getUser();
  if (uErr) throw uErr;
  if (!user) throw new Error("Not logged in");

const role = await getCurrentUserRole();
if (role !== "learner") {
  throw new Error("Only learners can enroll");
}

  const { error } = await supabase
    .from("course_enrollments")
    .insert({ user_id: user.id, course_id: courseId });

  if (error && !String(error.message).toLowerCase().includes("duplicate")) {
    throw error;
  }

  revalidatePath("/courses");
  revalidatePath(`/courses/${courseId}`);
}

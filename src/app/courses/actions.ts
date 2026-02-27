"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/getRole";

// ---------- helpers (production-safe guards) ----------
function isUuid(v: string) {
  // UUID v1–v5
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v
  );
}

function readRequiredUuid(formData: FormData, key: string) {
  const raw = formData.get(key);

  // FormData can return: null | string | File
  if (typeof raw !== "string") throw new Error(`Missing or invalid ${key}`);

  const v = raw.trim();

  // reject common bad values that turn into uuid errors
  if (!v || v === "undefined" || v === "null") throw new Error(`Missing ${key}`);
  if (!isUuid(v)) throw new Error(`Invalid ${key}`);

  return v;
}

function assertUuid(value: string, keyName: string) {
  const v = String(value ?? "").trim();
  if (!v || v === "undefined" || v === "null") throw new Error(`Missing ${keyName}`);
  if (!isUuid(v)) throw new Error(`Invalid ${keyName}`);
  return v;
}

// ---------- actions ----------
export async function markLessonComplete(formData: FormData) {
  const courseId = readRequiredUuid(formData, "courseId");
  const lessonId = readRequiredUuid(formData, "lessonId");

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser();

  if (uErr || !user) throw new Error("Not logged in");

  // Idempotent write (no duplicate handling needed)
  // Requires UNIQUE(user_id, lesson_id) — you already have it ✅
  const { error } = await supabase
    .from("lesson_progress")
    .upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" }
    );

  if (error) throw error;

  revalidatePath(`/courses/${courseId}`);
  revalidatePath(`/courses`);
}

export async function markLessonIncomplete(formData: FormData) {
  const courseId = readRequiredUuid(formData, "courseId");
  const lessonId = readRequiredUuid(formData, "lessonId");

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
}

export async function enrollInCourse(courseId: string) {
  const safeCourseId = assertUuid(courseId, "courseId");

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser();

  if (uErr) throw uErr;
  if (!user) throw new Error("Not logged in");

  const role = await getCurrentUserRole();
  if (role !== "learner") {
    throw new Error("Only learners can enroll");
  }

  // Prefer idempotent upsert (requires UNIQUE(user_id, course_id) on course_enrollments)
  const { error } = await supabase
    .from("course_enrollments")
    .upsert(
      { user_id: user.id, course_id: safeCourseId },
      { onConflict: "user_id,course_id" }
    );

  if (error) throw error;

  revalidatePath("/courses");
  revalidatePath(`/courses/${safeCourseId}`);
}

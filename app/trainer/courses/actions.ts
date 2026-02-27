"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/getRole";
// --------------------
// COURSES
// --------------------

export async function createCourse(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  if (!title) throw new Error("Title required");

  const { data, error } = await supabase
    .from("courses")
    .insert({ title, description })
    .select()
    .single();

  if (error) throw error;
  if (!data?.id) throw new Error("Course ID not returned from Supabase");

  revalidatePath("/trainer/courses");
  redirect(`/trainer/courses/${data.id}/edit`);
}

export async function updateCourse(courseId: string, formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const is_published = formData.get("is_published") === "on";

  const { error } = await supabase
    .from("courses")
    .update({ title, description, is_published })
    .eq("id", courseId);

  if (error) throw error;

  revalidatePath(`/trainer/courses/${courseId}/edit`);
  revalidatePath("/trainer/courses");
  // optional: keep guest catalog fresh if you toggle publish here too
  revalidatePath("/courses");
  revalidatePath(`/courses/${courseId}`);
}

// --------------------
// SECTIONS
// --------------------

export async function addSection(courseId: string, formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("Section title required");

  const { data: rows, error: posErr } = await supabase
    .from("course_sections")
    .select("position")
    .eq("course_id", courseId)
    .order("position", { ascending: false })
    .limit(1);

  if (posErr) throw posErr;

  const nextPos = (rows?.[0]?.position ?? 0) + 1;

  const { error } = await supabase
    .from("course_sections")
    .insert({ course_id: courseId, title, position: nextPos });

  if (error) throw error;

  revalidatePath(`/trainer/courses/${courseId}/edit`);
}

// --------------------
// LESSONS
// --------------------

export async function addLesson(sectionId: string, formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("Lesson title required");

  // Find course_id for correct revalidate (section -> course)
  const { data: sec, error: sErr } = await supabase
    .from("course_sections")
    .select("course_id")
    .eq("id", sectionId)
    .single();

  if (sErr) throw sErr;
  if (!sec?.course_id) throw new Error("Course not found for section");

  const { data: rows, error: posErr } = await supabase
    .from("course_lessons")
    .select("position")
    .eq("section_id", sectionId)
    .order("position", { ascending: false })
    .limit(1);

  if (posErr) throw posErr;

  const nextPos = (rows?.[0]?.position ?? 0) + 1;

  const { error } = await supabase
    .from("course_lessons")
    .insert({ section_id: sectionId, title, position: nextPos });

  if (error) throw error;

  revalidatePath(`/trainer/courses/${sec.course_id}/edit`);
}

export async function deleteLesson(lessonId: string) {
  const supabase = await createSupabaseServerClient();

  const { data: lesson, error: lErr } = await supabase
    .from("course_lessons")
    .select("id, section_id")
    .eq("id", lessonId)
    .single();

  if (lErr) throw lErr;
  if (!lesson?.section_id) throw new Error("Lesson not found");

  const { data: sec, error: sErr } = await supabase
    .from("course_sections")
    .select("course_id")
    .eq("id", lesson.section_id)
    .single();

  if (sErr) throw sErr;
  if (!sec?.course_id) throw new Error("Course not found for section");

  const { error } = await supabase
    .from("course_lessons")
    .delete()
    .eq("id", lessonId);

  if (error) throw error;

  revalidatePath(`/trainer/courses/${sec.course_id}/edit`);
}

// --------------------
// ENROLLMENTS
// --------------------

export async function enrollByEmail(courseId: string, formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email) throw new Error("Email is required");

  // Find user by email via users_view (you already use this)
  const { data: user, error: uErr } = await supabase
    .from("users_view")
    .select("id,email")
    .eq("email", email)
    .single();

  if (uErr || !user?.id) throw new Error("User not found for that email");

  const { error } = await supabase.from("course_enrollments").insert({
    course_id: courseId,
    user_id: user.id,
  });

  // ignore duplicate enrollments gracefully
  if (error && !String(error.message).toLowerCase().includes("duplicate")) throw error;

  revalidatePath(`/trainer/courses/${courseId}/edit`);
}

export async function unenroll(courseId: string, userId: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("course_enrollments")
    .delete()
    .eq("course_id", courseId)
    .eq("user_id", userId);

  if (error) throw error;

  revalidatePath(`/trainer/courses/${courseId}/edit`);
}

export async function listEnrollments(courseId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("course_enrollments")
    .select("user_id, enrolled_at")
    .eq("course_id", courseId)
    .order("enrolled_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// --------------------
// LESSON CONTENT
// --------------------

export async function updateLessonContent(lessonId: string, formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const content = String(formData.get("content") ?? "");

  const { data: lesson, error: lErr } = await supabase
    .from("course_lessons")
    .select("id, section_id")
    .eq("id", lessonId)
    .single();

  if (lErr) throw lErr;
  if (!lesson?.section_id) throw new Error("Lesson not found");

  const { data: sec, error: sErr } = await supabase
    .from("course_sections")
    .select("course_id")
    .eq("id", lesson.section_id)
    .single();

  if (sErr) throw sErr;
  if (!sec?.course_id) throw new Error("Course not found for section");

  const { error } = await supabase
    .from("course_lessons")
    .update({ content })
    .eq("id", lessonId);

  if (error) throw error;

  revalidatePath(`/trainer/courses/${sec.course_id}/edit`);
}

// --------------------
// PUBLISH (DEV) — Step 7
// Requires Supabase RPC: public.set_course_publish(uuid, boolean)
// --------------------

export async function setCoursePublished(courseId: string, publish: boolean) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.rpc("set_course_publish", {
    p_course_id: courseId,
    p_publish: publish,
  });

  if (error) throw error;

  // Refresh guest + trainer pages
  revalidatePath("/courses");
  revalidatePath(`/courses/${courseId}`);
  revalidatePath("/trainer/courses");
  revalidatePath("/my-courses");
}
export async function setLessonPublished(formData: FormData) {
  const courseId = String(formData.get("courseId") || "");
  const lessonId = String(formData.get("lessonId") || "");
  const publish = String(formData.get("publish") || "") === "true";

  if (!lessonId) throw new Error("Missing lessonId");

  // dev-only (authoring)
  const role = await getCurrentUserRole();
  if (role !== "dev") throw new Error("Dev access only.");

  const supabase = await createSupabaseServerClient();

  const patch: {
  is_published: boolean;
  published_at?: string | null;
} = {
  is_published: publish,
};


  // If your table has published_at, keep these 2 lines; otherwise delete them
  patch.published_at = publish ? new Date().toISOString() : null;

  const { error } = await supabase
    .from("course_lessons")
    .update(patch)
    .eq("id", lessonId);

  if (error) throw error;

  // refresh editor + learner pages
  if (courseId) revalidatePath(`/trainer/courses/${courseId}/edit`);
  revalidatePath("/trainer/courses");
  if (courseId) revalidatePath(`/my-courses/${courseId}`);
}
export async function bulkSetLessonsPublished(formData: FormData) {
  const courseId = String(formData.get("courseId") || "");
  const publish = String(formData.get("publish") || "") === "true";
  if (!courseId) throw new Error("Missing courseId");

  const role = await getCurrentUserRole();
  if (role !== "dev") throw new Error("Dev access only.");

  const supabase = await createSupabaseServerClient();

  // find all section ids
  const { data: sections, error: sErr } = await supabase
    .from("course_sections")
    .select("id")
    .eq("course_id", courseId);

  if (sErr) throw sErr;

  type SectionRow = { id: string };

const sectionRows = (sections ?? []) as SectionRow[];

const sectionIds = sectionRows.map((s) => s.id);
  if (!sectionIds.length) return;

const patch: { is_published: boolean; published_at?: string | null } = {
  is_published: publish,
};

// If your table has published_at keep this line, otherwise delete it
patch.published_at = publish ? new Date().toISOString() : null;
  const { error } = await supabase
    .from("course_lessons")
    .update(patch)
    .in("section_id", sectionIds);

  if (error) throw error;

  revalidatePath(`/trainer/courses/${courseId}/edit`);
  revalidatePath("/trainer/courses");
  revalidatePath(`/my-courses/${courseId}`);
}

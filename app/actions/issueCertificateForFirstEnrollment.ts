"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function issueCertificateForFirstEnrollment() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser();

  if (uErr || !user) throw new Error("Not logged in");

  // Get one enrolled course for this user
  const { data: enr, error: eErr } = await supabase
    .from("course_enrollments")
    .select("course_id")
    .eq("user_id", user.id)
    .order("enrolled_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (eErr) throw eErr;
  if (!enr?.course_id) throw new Error("No enrollments found for this user");

  const courseId = enr.course_id as string;

  const { error } = await supabase.from("certificates").upsert({ user_id: user.id, course_id: courseId, file_path: null, issued_at: new Date().toISOString() }, { onConflict: "user_id,course_id" });

  if (error) {
    console.error("CERT INSERT ERROR:", error);
    throw new Error(`${error.code}: ${error.message}`);
  }

  return { ok: true, courseId };
}

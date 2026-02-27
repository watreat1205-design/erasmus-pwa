"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function issueCertificateTest(courseId: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser();

  if (uErr || !user) {
    throw new Error("Not logged in");
  }

  const { error } = await supabase
    .from("certificates")
    .insert({
      user_id: user.id,
      course_id: courseId,
      file_path: null,
      issued_at: new Date().toISOString(),
    });

  if (error) {
    console.error("CERT INSERT ERROR:", error);
    throw new Error(`${error.code}: ${error.message}`);
  }

  return { ok: true };
}

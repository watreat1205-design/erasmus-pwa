"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function enroll(formData: FormData) {
  const user_id = String(formData.get("user_id") ?? "").trim();
  const course_id = String(formData.get("course_id") ?? "").trim();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("profiles").upsert({
  user_id: user.id,
  role: "trainer",
  full_name: null,
});


  if (!user_id || !course_id) redirect("/trainer/enroll");

  await supabase.from("enrollments").insert({ user_id, course_id });
  redirect("/trainer/enroll");
}

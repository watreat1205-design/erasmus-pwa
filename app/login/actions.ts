"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache"; // ✅ add this
import { createSupabaseServerClient } from "@/lib/supabase/server";

// 🔹 Demo learner auto-login
export async function loginAsLearnerDemo() {
  const supabase = await createSupabaseServerClient();

  const email = process.env.DEMO_LEARNER_EMAIL!;
  const password = process.env.DEMO_LEARNER_PASSWORD!;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  revalidatePath("/welcome"); // ✅ add this
  redirect("/welcome");
}

// 🔹 Normal login
export async function login(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const nextRaw = String(formData.get("next") || "/welcome");
  const nextUrl = nextRaw.startsWith("/") ? nextRaw : "/welcome";

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  // ✅ IMPORTANT: refresh server components that read auth
  revalidatePath("/welcome");
  revalidatePath("/dashboard"); // optional but helpful
  revalidatePath("/courses");   // optional but helpful

  redirect(nextUrl);
}

// src/lib/auth/getProfile.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "./roles";

export async function getMyProfile() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("getMyProfile error:", error);

    return {
      id: user.id,
      email: user.email ?? null,
      full_name: (user.user_metadata?.full_name as string | undefined) ?? null,
      role: "learner" as UserRole,
    };
  }

  if (!profile) {
    return {
      id: user.id,
      email: user.email ?? null,
      full_name: (user.user_metadata?.full_name as string | undefined) ?? null,
      role: "learner" as UserRole,
    };
  }

  return {
    ...profile,
    role: (profile.role ?? "learner") as UserRole,
  };
}

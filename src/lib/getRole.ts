// src/lib/getRole.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/auth/roles";

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("getCurrentUserRole error:", error);
    return null;
  }

  const role = data?.role;

  if (role === "trainer" || role === "admin" || role === "dev") {
    return role;
  }

  return null;
}

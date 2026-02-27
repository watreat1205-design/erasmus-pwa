import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "./roles";

export async function getMyProfile() {
  const supabase = await createSupabaseServerClient();

  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("getMyProfile error:", error);
    return null;
  }

  return {
    ...profile,
    role: profile.role as UserRole,
  };
}

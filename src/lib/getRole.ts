import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/auth/roles";

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !data?.role) return null;
  return data.role as UserRole;
}

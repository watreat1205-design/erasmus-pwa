"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/getRole";
import type { UserRole } from "@/lib/auth/roles";

export async function setUserRoleAction(targetUserId: string, newRole: UserRole) {
  const role = await getCurrentUserRole();
  if (role !== "dev") {
    return { ok: false, error: "Only dev can change roles." };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.rpc("set_user_role", {
    target_user: targetUserId,
    new_role: newRole,
  });

  if (error) return { ok: false, error: error.message };

  return { ok: true as const };
}

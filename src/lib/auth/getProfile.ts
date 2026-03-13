// src/lib/auth/getProfile.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "./roles";

function normalizeRole(role: string | null | undefined): UserRole {
  if (role === "dev" || role === "admin" || role === "trainer") return role;
  return "trainer";
}

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
      role: "trainer" as UserRole,
    };
  }

  if (!profile) {
    return {
      id: user.id,
      email: user.email ?? null,
      full_name: (user.user_metadata?.full_name as string | undefined) ?? null,
      role: "trainer" as UserRole,
    };
  }

  return {
    ...profile,
    role: normalizeRole(profile.role),
  };
}

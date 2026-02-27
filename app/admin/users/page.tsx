import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/getRole";
import { canViewAdmin } from "@/lib/rbac";
import { redirect } from "next/navigation";
import RoleForm from "./role-form";

type UserRole = "trainer" | "learner" | "dev";

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: UserRole | null;
};

export default async function AdminUsersPage() {
  const role = await getCurrentUserRole();
  if (!role) redirect("/login");
  if (!canViewAdmin(role)) redirect("/dashboard");

  const supabase = await createSupabaseServerClient();

  const { data: profilesRaw, error } = await supabase.rpc("admin_list_profiles");

  // Normalize to array no matter what (and keep TS happy)
  const profiles: ProfileRow[] = Array.isArray(profilesRaw)
    ? (profilesRaw as ProfileRow[])
    : profilesRaw
      ? [profilesRaw as ProfileRow]
      : [];

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Users</h1>
        <p className="mt-3 text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Users</h1>
      <p className="mt-2 text-sm text-gray-600">
        Only <b>dev</b> can change roles.
      </p>

      <div className="mt-6 space-y-3">
        {profiles.map((p) => (
          <div key={p.id} className="rounded-xl border p-4">
            <div className="font-medium">{p.full_name || "—"}</div>
            <div className="text-sm text-gray-600">{p.email || "—"}</div>

            <div className="mt-2 text-sm">
              Current role: <b>{p.role || "—"}</b>
            </div>

            <div className="mt-3">
              {role === "dev" ? (
                <RoleForm targetUserId={p.id} currentRole={p.role} />
              ) : (
                <div className="text-sm text-gray-600">Read-only</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

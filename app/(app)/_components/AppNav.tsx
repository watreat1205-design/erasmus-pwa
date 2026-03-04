import { getCurrentUserRole } from "@/lib/getRole";
import { canAuthorContent, canViewAdmin } from "@/lib/rbac";
import AppNavClient from "./AppNavClient";

export default async function AppNav() {
  const role = await getCurrentUserRole();

  return (
    <AppNavClient
      role={role}
      canViewAdmin={!!(role && canViewAdmin(role))}
      canAuthorContent={!!(role && canAuthorContent(role))}
    />
  );
}

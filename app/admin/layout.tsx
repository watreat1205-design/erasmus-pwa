import { redirect } from "next/navigation";
import { getCurrentUserRole } from "@/lib/getRole";
import { canViewAdmin } from "@/lib/rbac";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const role = await getCurrentUserRole();
  if (!role) redirect("/login");
  if (!canViewAdmin(role)) redirect("/unauthorized");
  return <>{children}</>;
}

import { redirect } from "next/navigation";
import { getCurrentUserRole } from "@/lib/getRole";
import { canAuthorContent } from "@/lib/rbac";

export default async function AuthorLayout({ children }: { children: React.ReactNode }) {
  const role = await getCurrentUserRole();
  if (!role) redirect("/login");
  if (!canAuthorContent(role)) redirect("/unauthorized");
  return <>{children}</>;
}

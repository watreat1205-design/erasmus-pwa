import Link from "next/link";
import { getCurrentUserRole } from "@/lib/getRole";
import { canAuthorContent, canViewAdmin } from "@/lib/rbac";

export default async function AppNav() {
  const role = await getCurrentUserRole();

  return (
    <nav className="flex items-center gap-4">
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/my-courses">Courses</Link>

      {role && canViewAdmin(role) && (
        <>
          <Link href="/admin">Admin</Link>
          <Link href="/admin/users">Users</Link>
        </>
      )}

      {role && canAuthorContent(role) && (
        <Link href="/author">Authoring</Link>
      )}

      <Link href="/profile">Profile</Link>
    </nav>
  );
}

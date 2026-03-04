"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ensureI18n } from "@/i18n";

type Props = {
  role: string | null;
  canViewAdmin: boolean;
  canAuthorContent: boolean;
};

export default function AppNavClient({
  role,
  canViewAdmin,
  canAuthorContent,
}: Props) {
  useEffect(() => {
    ensureI18n();
  }, []);

  const { t } = useTranslation();

  return (
    <nav className="flex items-center gap-4">
      <Link href="/dashboard">{t("nav.dashboard")}</Link>
      <Link href="/my-courses">{t("nav.courses")}</Link>

      {role && canViewAdmin && (
        <>
          <Link href="/admin">Admin</Link>
          <Link href="/admin/users">Users</Link>
        </>
      )}

      {role && canAuthorContent && (
        <Link href="/author">Authoring</Link>
      )}

      <Link href="/profile">Profile</Link>
    </nav>
  );
}

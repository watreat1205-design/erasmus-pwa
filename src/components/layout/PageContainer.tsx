// src/components/layout/PageContainer.tsx
"use client";

import { usePathname } from "next/navigation";

export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const noChrome =
    pathname === "/welcome" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/reset-password");

  return (
    <div
      className={
        noChrome
          ? ""
          : "pt-[calc(var(--global-header-height,0px)+16px)]"
      }
    >
      {children}
    </div>
  );
}

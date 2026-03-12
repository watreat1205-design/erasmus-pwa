"use client";

import { usePathname } from "next/navigation";

export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const noHeader = pathname === "/welcome";

  return <div className={noHeader ? "" : "pt-20"}>{children}</div>;
}

"use client";

import { usePathname } from "next/navigation";
import FooterPartners from "@/components/layout/FooterPartners";

export default function GlobalFooter() {
  const pathname = usePathname();

  const noChrome =
    pathname === "/welcome" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/reset-password");

  if (noChrome) {
    return null;
  }

  return <FooterPartners compact />;
}

// src/components/layout/GlobalFooter.tsx
"use client";

import { usePathname } from "next/navigation";
import FooterPartners from "@/components/layout/FooterPartners";

export default function GlobalFooter() {
  const pathname = usePathname();

  if (pathname === "/welcome") return null;

  return <FooterPartners compact />;
}

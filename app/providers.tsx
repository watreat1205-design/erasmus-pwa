// app/providers.tsx
"use client";

import { ensureI18n } from "../src/i18n";

ensureI18n();

export default function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

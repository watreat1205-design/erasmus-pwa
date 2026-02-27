"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

const SUPPORTED = new Set(["en", "el", "it", "es", "ro", "hr"]);

export default function TestTranslations() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const lang = searchParams.get("lang");
    if (lang && SUPPORTED.has(lang)) {
      i18n.changeLanguage(lang);
      try {
        localStorage.setItem("lang", lang);
      } catch {}
    }
    setMounted(true);
  }, [searchParams]);

  // Prevent SSR/client mismatch
  if (!mounted) return null;

  return (
    <div className="mt-4">
      <h1>{t("appName")}</h1>
      <button>{t("buttons.start")}</button>
    </div>
  );
}

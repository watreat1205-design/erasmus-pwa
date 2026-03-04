"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ensureI18n } from "@/i18n";

export default function T({
  k,
  values,
  fallback,
}: {
  k: string;
  values?: Record<string, any>;
  fallback?: string;
}) {
  useEffect(() => {
    ensureI18n();
  }, []);

  const { t } = useTranslation("common");
  const txt = t(k, values);
  return <>{txt === k && fallback ? fallback : txt}</>;
}

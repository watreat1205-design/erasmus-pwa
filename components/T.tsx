"use client";

import { useTranslation } from "react-i18next";

type TProps = {
  k: string;
  fallback?: string;
};

export default function T({ k, fallback }: TProps) {
  const { t } = useTranslation();
  return <>{t(k, { defaultValue: fallback ?? k })}</>;
}

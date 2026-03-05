"use client";

import { useTranslation } from "react-i18next";

type Props = {
  k: string;
  fallback?: string;
};

export default function T({ k, fallback }: Props) {
  const { t } = useTranslation();
  return <>{t(k, { defaultValue: fallback ?? k })}</>;
}

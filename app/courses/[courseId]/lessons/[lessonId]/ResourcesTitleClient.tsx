"use client";

import { useTranslation } from "react-i18next";

export default function ResourcesTitleClient() {
  const { t } = useTranslation("common");
  return <>{t("resources.title")}</>;
}

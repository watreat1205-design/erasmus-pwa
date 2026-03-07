"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ensureI18n } from "@/i18n";

type Card = {
  titleKey: string;
  descKey: string;
  href: string;
};

export default function DashboardClient({
  displayName,
  cards,
  isDev,
}: {
  displayName: string;
  cards: Card[];
  isDev: boolean;
}) {
  useEffect(() => {
    ensureI18n();
  }, []);

  const { t } = useTranslation("common");

  return (
    <div className="relative">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold !text-white sm:text-4xl">
              {t("dashboard.welcomeBack", { name: displayName })}
            </h1>
            <p className="mt-2 text-sm !text-white sm:text-base">
              {t("dashboard.chooseNext")}
            </p>
          </div>

          <div className="flex w-full gap-3 sm:w-auto">
            <Link
              href="/welcome"
              prefetch={false}
              className="inline-flex flex-1 items-center justify-center rounded-md border border-white/40 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20 sm:flex-none sm:w-auto"
            >
              {t("nav.welcomePage")}
            </Link>

            <Link
              href="/logout"
              prefetch={false}
              className="inline-flex flex-1 items-center justify-center rounded-md bg-black px-4 py-3 text-sm font-semibold !text-white shadow-sm hover:bg-gray-900 sm:flex-none sm:w-auto"
            >
              {t("nav.logout")}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              prefetch={false}
              className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t(c.titleKey)}
                </h2>
                <span className="text-gray-400 transition group-hover:translate-x-0.5">
                  →
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-600">{t(c.descKey)}</p>

              <div className="mt-4 text-sm font-medium text-gray-900 underline-offset-4 group-hover:underline">
                {t("common.open")}
              </div>
            </Link>
          ))}

          {isDev && (
            <Link
              href="/trainer/courses"
              prefetch={false}
              className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t("dashboard.trainerPanel")}
                </h2>
                <span className="text-gray-400 transition group-hover:translate-x-0.5">
                  →
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-600">
                {t("dashboard.trainerPanelDesc")}
              </p>

              <div className="mt-4 text-sm font-medium text-gray-900 underline-offset-4 group-hover:underline">
                {t("common.open")}
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

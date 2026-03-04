"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ensureI18n } from "@/i18n";

export default function QuizPaper({
  activityTitle,
  quizTitle,
  children,
}: {
  activityTitle: string;
  quizTitle: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    ensureI18n();
  }, []);

  const { t } = useTranslation("common");
  const router = useRouter();

  return (
    // ✅ No page background here; the page/layout provides the background
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[900px] px-4 py-10">
        {/* A4-like sheet */}
        <div className="mx-auto w-full rounded-md border border-gray-200 bg-white shadow-sm">
          {/* Optional top brand bar (keep if you use it elsewhere) */}

          <div className="px-6 pt-8 pb-2 flex justify-center">
            <img
              src="/brand/drops-logo.png"
              alt="DROPS"
              className="h-48 object-contain"
            />
          </div>

          {/* Title box */}
          <div className="px-6 pb-6 pt-4">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="h-2 bg-[#3b8f6b]" />
              <div className="p-6">
                {/* ✅ Back button */}
                <div className="mb-3 flex justify-end">
                  <button
                    onClick={() => router.back()}
                    className="text-sm font-medium text-gray-700 hover:underline"
                    type="button"
                  >
                    ← {t("common.back")}
                  </button>
                </div>

                <div className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                  {activityTitle}
                </div>

                <h1 className="mt-2 text-xl font-semibold text-gray-900">
                  {quizTitle}
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-700">
                  {t("quizPaper.intro")}
                </p>

                <p className="mt-4 text-sm leading-6 text-gray-700">
                  {t("quizPaper.quote")}
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-700">
                  <span className="font-semibold">{t("quizPaper.noteLabel")}</span>{" "}
                  {t("quizPaper.noteBody")}
                </p>

                <div className="mt-3 text-xs text-gray-500">
                  <span className="text-red-600">*</span>{" "}
                  {t("quizPaper.requiredHint")}
                </div>
              </div>
            </div>

            {/* Questions/content */}
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

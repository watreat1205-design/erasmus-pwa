// src/components/quiz/QuizPaper.tsx
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
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[900px] px-4 py-10">
        <div className="mx-auto w-full rounded-md border border-gray-200 bg-white shadow-sm">
          <div className="flex justify-center px-6 pt-8 pb-2">
            <img
              src="/brand/drops-logo.png"
              alt="DROPS"
              className="h-48 object-contain"
            />
          </div>

          <div className="px-6 pt-4 pb-6">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="h-2 bg-[#3b8f6b]" />
              <div className="p-6">
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

                <div className="mt-3 text-xs text-gray-500">
                  <span className="text-red-600">*</span> Required question
                </div>
              </div>
            </div>

            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

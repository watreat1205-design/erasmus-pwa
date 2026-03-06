"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ensureI18n } from "@/i18n";

type QuizListItem = {
  id: string;
  title: string;
  pass_score: number | null;
  courseTitle: string;
  lastAttempt: {
    passed: boolean;
    score_percent: number | null;
  } | null;
  isUnlocked: boolean;
};

export default function QuizzesClient({
  quizzes,
}: {
  quizzes: QuizListItem[];
}) {
  useEffect(() => {
    ensureI18n();
  }, []);

  const { t } = useTranslation("common");

  return (
    <div className="relative">
      <div className="mx-auto max-w-5xl p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold !text-white">
              {t("quizzes.title")}
            </h1>
            <p className="mt-1 text-sm !text-white">
              {t("quizzes.subtitle")}
            </p>
          </div>

          <Link
            href="/dashboard"
            prefetch={false}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
          >
            {t("common.back")}
          </Link>
        </div>

        {quizzes.length === 0 ? (
          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">
              {t("quizzes.emptyTitle")}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {t("quizzes.emptyBody")}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {quizzes.map((q) => (
              <div
                key={q.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="text-sm text-gray-600">{q.courseTitle}</div>

                <div className="mt-1 text-base font-semibold text-gray-900">
                  {q.title}
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  {t("quizzes.passScore")}{" "}
                  <span className="font-medium">{q.pass_score ?? "-"}%</span>
                </div>

                {q.lastAttempt ? (
                  <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">
                        {t("quizzes.lastAttempt")}
                      </span>
                      <span
                        className={
                          "rounded-full px-2 py-1 text-xs font-medium " +
                          (q.lastAttempt.passed
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700")
                        }
                      >
                        {q.lastAttempt.passed
                          ? t("quizzes.passed")
                          : t("quizzes.notPassed")}
                      </span>
                    </div>

                    <div className="mt-1 text-gray-700">
                      {t("quizzes.score")}{" "}
                      <span className="font-medium">
                        {q.lastAttempt.score_percent ?? "-"}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 text-sm text-gray-600">
                    {t("quizzes.noAttempts")}
                  </div>
                )}

                {q.isUnlocked ? (
                  <Link
                    href={`/quizzes/${q.id}`}
                    prefetch={false}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-semibold !text-white hover:bg-gray-900"
                  >
                    {q.lastAttempt ? t("quizzes.retake") : t("quizzes.start")}
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="mt-4 inline-flex w-full cursor-not-allowed items-center justify-center rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-600"
                    title={t("quizzes.lockedHint")}
                  >
                    🔒 {t("quizzes.locked")}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

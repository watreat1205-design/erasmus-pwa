// app/certificates/CertificatesClient.tsx
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ensureI18n } from "@/i18n";

type CertificateRow = {
  id: string;
  issued_at: string;
  certificate_number: string | null;
  verification_code: string | null;
  scope: string;
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
      {children}
    </span>
  );
}

export default function CertificatesClient({
  isLoggedIn,
  cert,
  errorMessage,
  eligible,
  completedCourses,
  totalCourses,
}: {
  isLoggedIn: boolean;
  cert: CertificateRow | null;
  errorMessage: string | null;
  eligible: boolean;
  completedCourses: number;
  totalCourses: number;
}) {
  useEffect(() => {
    ensureI18n();
  }, []);

  const { t } = useTranslation("common");

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold !text-white">
              {t("certificates.title")}
            </h1>
            <p className="mt-1 text-sm text-gray-900">
              {t("certificates.loginToView")}
            </p>
          </div>

          <Link
            href="/login?next=/certificates"
            prefetch={false}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
          >
            {t("auth.login")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold !text-white">
            {t("certificates.title")}
          </h1>
          <p className="mt-1 text-sm text-gray-900">
            Final certificate for the full DROPS programme.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Pill>
              {completedCourses}/{totalCourses} modules completed
            </Pill>
            <Pill>{cert ? "1 final certificate" : "No certificate yet"}</Pill>
            <Pill>{t("certificates.pdfDownload")}</Pill>
          </div>
        </div>

        <Link
          href="/dashboard"
          prefetch={false}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
        >
          {t("common.back")}
        </Link>
      </div>

      {errorMessage ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      {!cert ? (
        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
              🎓
            </div>

            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-900">
                No final certificate yet
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Complete all required modules, activities, and assessments to
                unlock the final DROPS certificate.
              </p>

              <p className="mt-3 text-sm font-medium text-gray-800">
                Progress: {completedCourses}/{totalCourses} modules completed
              </p>

              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-emerald-600 transition-all"
                  style={{
                    width: `${totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0}%`,
                  }}
                />
              </div>

              <Link
                href="/courses"
                prefetch={false}
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-semibold !text-white hover:bg-gray-900"
              >
                {t("certificates.goToMyCourses")}
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 max-w-2xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-gray-900">
                  Final DROPS Certificate
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  Issued: {new Date(cert.issued_at).toLocaleString()}
                </div>
                {cert.certificate_number ? (
                  <div className="mt-1 text-sm text-gray-600">
                    Certificate ID: {cert.certificate_number}
                  </div>
                ) : null}
              </div>

              <Pill>Completed</Pill>
            </div>

            <div className="mt-4">
              <a
                href="/api/certificates/final"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-semibold !text-white hover:bg-gray-900"
              >
                Download final certificate PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

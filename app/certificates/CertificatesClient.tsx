"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ensureI18n } from "@/i18n";
import CertificateDownloadButton from "../components/CertificateDownloadButton";

type CourseMini = { id: string; title: string };

type CertificateRow = {
  id: string;
  issued_at: string;
  courses: CourseMini | null;
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
  certs,
  errorMessage,
}: {
  isLoggedIn: boolean;
  certs: CertificateRow[];
  errorMessage: string | null;
}) {
  useEffect(() => {
    ensureI18n();
  }, []);

  const { t } = useTranslation();

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold !text-white">
              {t("certificates.title")}
            </h1>
            <p className="mt-1 text-sm text-gray-900">
              {t("certificates.loginToView")}
            </p>
          </div>
          <Link
            href="/login"
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
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold !text-white">
            {t("certificates.title")}
          </h1>
          <p className="mt-1 text-sm text-gray-900">
            {t("certificates.subtitle")}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Pill>{t("certificates.total", { count: certs.length })}</Pill>
            <Pill>{t("certificates.pdfDownload")}</Pill>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
        >
          {t("common.back")}
        </Link>
      </div>

      {/* Error */}
      {errorMessage ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      {/* Empty state */}
      {certs.length === 0 ? (
        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
              🎓
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-900">
                {t("certificates.emptyTitle")}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {t("certificates.emptyBody")}
              </p>

              <Link
                href="/my-courses"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-semibold !text-white hover:bg-gray-900"
                style={{ color: "#fff" }}
              >
                {t("certificates.goToMyCourses")}
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-gray-900">
                    {cert.courses?.title ?? t("courses.courseFallback")}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {t("certificates.issued")}:{" "}
                    {new Date(cert.issued_at).toLocaleString()}
                  </div>
                </div>
                <Pill>{t("certificates.completed")}</Pill>
              </div>

              <div className="mt-4">
                {cert.courses?.id ? (
                  <CertificateDownloadButton courseId={cert.courses.id} />
                ) : (
                  <button
                    disabled
                    className="inline-flex w-full items-center justify-center rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-600"
                  >
                    {t("certificates.unavailable")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

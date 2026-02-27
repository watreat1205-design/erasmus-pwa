// src/app/certificates/page.tsx
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
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

export default async function CertificatesPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
            <p className="mt-1 text-sm text-gray-600">
              Please log in to view your certificates.
            </p>
          </div>
          <Link
            href="/login"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  // (Optional) dev-only debug helper. Keep it hidden in production UI.
  // Remove entirely if you don't need it.
  const showDebug = process.env.NODE_ENV !== "production";

  const { data, error } = await supabase
    .from("certificates")
    .select("id, issued_at, courses(id, title)")
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false });

  const certs: CertificateRow[] = (data ?? []).map((row) => {
    const r = row as {
      id: unknown;
      issued_at: unknown;
      courses: unknown;
    };

    const courses =
      r.courses &&
      typeof r.courses === "object" &&
      "id" in (r.courses as Record<string, unknown>) &&
      "title" in (r.courses as Record<string, unknown>)
        ? {
            id: String((r.courses as Record<string, unknown>).id ?? ""),
            title: String((r.courses as Record<string, unknown>).title ?? ""),
          }
        : null;

    return {
      id: String(r.id),
      issued_at: String(r.issued_at),
      courses: courses && courses.id ? courses : null,
    };
  });

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
          <p className="mt-1 text-sm text-gray-600">
            Your earned course certificates.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Pill>{String(certs.length)} total</Pill>
            <Pill>PDF download</Pill>
          </div>
        
        </div>

        <Link
          href="/dashboard"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
        >
          Back
        </Link>
      </div>

      {/* Error */}
      {error ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error.message}
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
                No certificates yet
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Complete a course to earn one. When a course reaches 100%, your
                certificate will appear here.
              </p>

              <Link
                href="/my-courses"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-semibold !text-white hover:bg-gray-900"
                style={{ color: "#fff" }}
              >
                Go to My Courses
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
                    {cert.courses?.title ?? "Course"}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    Issued: {new Date(cert.issued_at).toLocaleString()}
                  </div>
                </div>
                <Pill>Completed</Pill>
              </div>

              <div className="mt-4">
                {cert.courses?.id ? (
                  <CertificateDownloadButton courseId={cert.courses.id} />
                ) : (
                  <button
                    disabled
                    className="inline-flex w-full items-center justify-center rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-600"
                  >
                    Certificate unavailable
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

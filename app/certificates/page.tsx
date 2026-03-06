// app/certificates/page.tsx
import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import CertificatesClient from "./CertificatesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CourseMini = { id: string; title: string };

type CertificateRow = {
  id: string;
  issued_at: string;
  courses: CourseMini | null;
};

export default async function CertificatesPage() {
  noStore();

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return (
      <CertificatesClient isLoggedIn={false} certs={[]} errorMessage={null} />
    );
  }

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
    <CertificatesClient
      isLoggedIn={true}
      certs={certs}
      errorMessage={error ? error.message : null}
    />
  );
}

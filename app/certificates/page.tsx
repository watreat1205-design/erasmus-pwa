// app/certificates/page.tsx
import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import CertificatesClient from "./CertificatesClient";
import { ensureFinalCertificateIssuedForCurrentUser } from "@/app/lib/certificates/final";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CertificateRow = {
  id: string;
  issued_at: string;
  certificate_number: string | null;
  verification_code: string | null;
  scope: string;
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
      <CertificatesClient
        isLoggedIn={false}
        cert={null}
        errorMessage={null}
        eligible={false}
        completedCourses={0}
        totalCourses={6}
      />
    );
  }

  const eligibility = await ensureFinalCertificateIssuedForCurrentUser();

  const { data, error } = await supabase
    .from("certificates")
    .select("id, issued_at, certificate_number, verification_code, scope")
    .eq("user_id", user.id)
    .eq("scope", "final")
    .maybeSingle();

  const cert = data
    ? ({
        id: String(data.id),
        issued_at: String(data.issued_at),
        certificate_number:
          data.certificate_number != null
            ? String(data.certificate_number)
            : null,
        verification_code:
          data.verification_code != null
            ? String(data.verification_code)
            : null,
        scope: String(data.scope),
      } satisfies CertificateRow)
    : null;

  return (
    <CertificatesClient
      isLoggedIn={true}
      cert={cert}
      errorMessage={error ? error.message : null}
      eligible={eligibility.eligible}
      completedCourses={eligibility.completedCourses}
      totalCourses={eligibility.totalCourses}
    />
  );
}

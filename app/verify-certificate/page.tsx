import { Suspense } from "react";
import VerifyCertificateClient from "./VerifyCertificateClient";

export const dynamic = "force-dynamic";

export default function VerifyCertificatePage() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <VerifyCertificateClient />
    </Suspense>
  );
}

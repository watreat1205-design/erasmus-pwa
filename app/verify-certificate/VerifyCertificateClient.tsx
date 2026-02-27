"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Certificate = {
  certificate_number: string;
  verification_code: string;
  issued_at: string;
};

type VerifyOk = { ok: true; certificate: Certificate };
type VerifyErr = { ok: false; error: string };

export default function VerifyCertificateClient() {
  const sp = useSearchParams();
  const urlCode = (sp.get("code") ?? "").trim();

  const [code, setCode] = useState(urlCode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyOk | VerifyErr | null>(null);

  const canSubmit = useMemo(() => code.trim().length >= 6, [code]);

  async function verify(c: string) {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(
        `/api/verify-certificate?code=${encodeURIComponent(c)}`,
        { cache: "no-store" }
      );
      const json = (await res.json()) as VerifyOk | VerifyErr;
      setResult(json);
    } catch {
      setResult({ ok: false, error: "Network error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold">Verify certificate</h1>

      <div className="mt-4 flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          placeholder="Enter verification code"
        />
        <button
          type="button"
          disabled={!canSubmit || loading}
          onClick={() => verify(code)}
          className="rounded-md border px-4 py-2"
        >
          {loading ? "Checking…" : "Verify"}
        </button>
      </div>

      {/* Success */}
      {result?.ok && (
        <div className="mt-4 rounded-xl border border-gray-200 p-4 bg-green-50">
          <div className="text-green-800 font-semibold text-lg">
            Valid Certificate ✅
          </div>

          <div className="mt-2 text-sm text-gray-800">
            <div>
              <strong>Certificate #:</strong>{" "}
              {result.certificate.certificate_number}
            </div>
            <div>
              <strong>Verification Code:</strong>{" "}
              {result.certificate.verification_code}
            </div>
            <div>
              <strong>Issued:</strong>{" "}
              {new Date(result.certificate.issued_at).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {result && !result.ok && (
        <div className="mt-4 rounded-xl border border-red-200 p-4 bg-red-50 text-red-800">
          Invalid certificate ❌ {result.error}
        </div>
      )}

      <div className="mt-6 text-sm">
        <Link href="/" className="underline">
          Back home
        </Link>
      </div>
    </div>
  );
}

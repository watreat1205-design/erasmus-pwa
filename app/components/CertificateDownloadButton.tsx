"use client";

import { useState } from "react";

export default function CertificateDownloadButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/certificates/${courseId}`);
      if (!res.ok) throw new Error("Failed to generate certificate");

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${courseId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Certificate could not be generated.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex w-full items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 disabled:bg-gray-400"
    >
      {loading ? "Preparing Certificate..." : "Download PDF"}
    </button>
  );
}

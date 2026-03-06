"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { toEmbed } from "@/lib/toEmbed";
import { useTranslation } from "react-i18next";

// ✅ Important for Next.js bundling of the worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type Props = {
  url: string; // signed/public URL to the PDF
  className?: string;
  initialScale?: number; // default 1
};

declare global {
  interface Window {
    openVideoModal?: (url: string) => void;
  }
}

export default function PdfDocumentViewer({
  url,
  className,
  initialScale = 1,
}: Props) {
  const { t } = useTranslation("common");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [scale, setScale] = useState<number>(initialScale);
  const [error, setError] = useState<string | null>(null);

  // Auto-resize to the card width (mobile friendly)
  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;
    const ro = new ResizeObserver(() => {
      const w = el.getBoundingClientRect().width;
      setContainerWidth(Math.max(240, Math.floor(w)));
    });

    ro.observe(el);
    const w0 = el.getBoundingClientRect().width;
    setContainerWidth(Math.max(240, Math.floor(w0)));

    return () => ro.disconnect();
  }, []);

  const file = useMemo(() => ({ url }), [url]);

  const handlePdfLinkClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    const a = target?.closest?.("a") as HTMLAnchorElement | null;
    if (!a?.href) return;

    const href = a.href;
    const lower = href.toLowerCase();

    const isYouTube =
      lower.includes("youtube.com/") ||
      lower.includes("youtu.be/") ||
      lower.includes("youtube-nocookie.com/");

    const isVimeo = lower.includes("vimeo.com/");
    const isVideo = isYouTube || isVimeo;

    const isForms =
      lower.includes("docs.google.com/forms") || lower.includes("forms.gle/");

    // Handle YouTube/Vimeo inside the platform
    if (isVideo) {
      e.preventDefault();
      e.stopPropagation();

      const embedUrl = toEmbed(href);

      if (typeof window !== "undefined" && typeof window.openVideoModal === "function") {
        window.openVideoModal(embedUrl);
        return;
      }

      const base = window.location.pathname.replace(/\/external\/?$/, "");
      window.location.assign(`${base}/external?url=${encodeURIComponent(embedUrl)}`);
      return;
    }

    // Keep forms inside your platform external page
    if (isForms) {
      e.preventDefault();
      e.stopPropagation();

      const base = window.location.pathname.replace(/\/external\/?$/, "");
      window.location.assign(`${base}/external?url=${encodeURIComponent(href)}`);
      return;
    }

    // Everything else: open in new tab
    a.target = "_blank";
    a.rel = "noreferrer";
  };

  return (
    <div className={className}>
      {/* Zoom controls */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-sm text-gray-600">
          {t("resources.document", { defaultValue: "Document" })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-xl border px-3 py-1 text-sm"
            onClick={() => setScale((s) => Math.max(0.6, +(s - 0.1).toFixed(2)))}
          >
            −
          </button>

          <div className="min-w-[60px] text-center text-sm text-gray-700">
            {Math.round(scale * 100)}%
          </div>

          <button
            type="button"
            className="rounded-xl border px-3 py-1 text-sm"
            onClick={() => setScale((s) => Math.min(2.0, +(s + 0.1).toFixed(2)))}
          >
            +
          </button>
        </div>
      </div>

      {/* Single capture handler for all PDF links */}
      <div
        ref={containerRef}
        className="w-full"
        onClickCapture={handlePdfLinkClickCapture}
      >
        <Document
          file={file}
          onLoadSuccess={(info) => {
            setNumPages(info.numPages);
            setError(null);
          }}
          onLoadError={(e) => setError(e?.message ?? "Failed to load PDF")}
          loading={<div className="p-4 text-sm text-gray-600">Loading PDF…</div>}
          error={<div className="p-4 text-sm text-red-600">Failed to load PDF.</div>}
        >
          {Array.from(new Array(numPages), (_el, index) => {
            const pageNumber = index + 1;

            return (
              <div key={pageNumber} className="mb-4 flex justify-center">
                <Page
                  pageNumber={pageNumber}
                  width={containerWidth ? Math.floor(containerWidth) : undefined}
                  scale={scale}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  loading={
                    <div className="p-4 text-sm text-gray-600">Loading page…</div>
                  }
                />
              </div>
            );
          })}
        </Document>

        {error ? (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <div className="font-medium">PDF viewer error</div>
            <div className="mt-1 break-words">{error}</div>
            <div className="mt-2">
              <a className="underline" href={url} target="_blank" rel="noreferrer">
                Open PDF in a new tab
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

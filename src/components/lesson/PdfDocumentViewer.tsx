"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { toEmbed } from "@/lib/toEmbed";


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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [scale, setScale] = useState<number>(initialScale);
  const [error, setError] = useState<string | null>(null);

  const handlePdfLinkClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement | null;
    const a = target?.closest?.("a") as HTMLAnchorElement | null;
    if (!a) return;

    const href = a.getAttribute("href") || "";
    if (!href) return;

    if (/youtube\.com|youtu\.be|vimeo\.com/.test(href)) {
      e.preventDefault();
      e.stopPropagation();
      window.openVideoModal?.(toEmbed(href));
    }
  };

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

  return (
    <div className={className}>
      {/* Zoom controls */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-sm text-gray-600">Document</div>
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

      {/* ✅ IMPORTANT: no fixed height + no overflow here.
          The parent container (materials) is the only scrollbar. */}
      <div
        ref={containerRef}
        className="w-full"
        onClick={(e) => {
          const t = e.target as HTMLElement | null;
          const a = t?.closest?.("a") as HTMLAnchorElement | null;
          if (!a?.href) return;

          const href = a.href;
          const isForms =
            href.includes("docs.google.com/forms") || href.includes("forms.gle/");
          if (!isForms) {
            a.target = "_blank";
            a.rel = "noreferrer";
            return;
          }

          e.preventDefault();
          e.stopPropagation();

          const base = window.location.pathname.replace(/\/external\/?$/, "");
          window.location.assign(`${base}/external?url=${encodeURIComponent(href)}`);
        }}
      >
        <div onClickCapture={handlePdfLinkClick}>
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
        </div>

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

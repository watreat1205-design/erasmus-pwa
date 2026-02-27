"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import PdfDocumentViewer from "@/components/lesson/PdfDocumentViewer";

// Ensure worker is set (safe even if set elsewhere too)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type Props = {
  url: string; // public or signed URL to slides PDF
  title?: string;
};

export default function SlidesPreviewModal({ url, title = "Slides (PDF)" }: Props) {
  const [open, setOpen] = useState(false);
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const [thumbWidth, setThumbWidth] = useState(640);
  const [numPages, setNumPages] = useState<number>(0);

  const file = useMemo(() => ({ url }), [url]);

  useEffect(() => {
    if (!thumbRef.current) return;
    const el = thumbRef.current;
    const ro = new ResizeObserver(() => {
      const w = Math.floor(el.getBoundingClientRect().width);
      setThumbWidth(Math.max(280, w));
    });
    ro.observe(el);
    setThumbWidth(Math.max(280, Math.floor(el.getBoundingClientRect().width)));
    return () => ro.disconnect();
  }, []);

  // ESC closes modal
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* ✅ Short “card button” with first slide preview */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition hover:shadow-md"
      >
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-gray-900">
              📄 {title}
            </div>
            <div className="mt-0.5 text-xs text-gray-600">
              {numPages ? `${numPages} pages` : "Click to open"}
            </div>
          </div>

          <div className="shrink-0 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white">
            View
          </div>
        </div>

        <div ref={thumbRef} className="bg-gray-50 px-4 py-4">
          <div className="flex justify-center">
            <Document
              file={file}
              onLoadSuccess={(info) => setNumPages(info.numPages)}
              loading={<div className="p-3 text-sm text-gray-600">Loading…</div>}
            >
              <Page
                pageNumber={1}
                width={thumbWidth}
                scale={0.9}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={<div className="p-3 text-sm text-gray-600">Loading…</div>}
              />
            </Document>
          </div>
        </div>
      </button>

      {/* ✅ Modal viewer (inside platform) */}
      {open ? (
        <div
          className="fixed inset-0 z-50"
          aria-modal="true"
          role="dialog"
          onMouseDown={(e) => {
            // click outside closes
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="absolute inset-0 bg-black/60" />

          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
              <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold text-gray-900">
                    {title}
                  </div>
                  <div className="text-xs text-gray-600">
                    Press ESC or click outside to close
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                >
                  ✕ Close
                </button>
              </div>

              {/* The modal content scrolls if needed, but the page does not */}
              <div className="max-h-[80vh] overflow-y-auto p-4">
                <PdfDocumentViewer url={url} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

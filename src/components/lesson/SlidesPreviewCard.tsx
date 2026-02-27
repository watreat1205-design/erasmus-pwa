"use client";

import { useState } from "react";
import PdfDocumentViewer from "@/components/lesson/PdfDocumentViewerNoSSR";

type Props = {
  slidesUrl: string;
  coverUrl?: string;
};

export default function SlidesPreviewCard({
  slidesUrl,
  coverUrl,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Card */}
      <div
        className="mt-6 cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
        onClick={() => setOpen(true)}
      >
        <div className="relative aspect-[16/9] w-full bg-gray-100">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt="Slides cover"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              Slides
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm font-semibold text-gray-900">
            Slides presentation
          </div>
          <div className="rounded-md border px-3 py-1 text-xs">
            Open
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative h-[90vh] w-[95vw] max-w-6xl overflow-hidden rounded-xl bg-white">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-md bg-white px-3 py-1 text-sm shadow"
            >
              Close
            </button>

            <div className="h-full overflow-auto p-6">
              <PdfDocumentViewer url={slidesUrl} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

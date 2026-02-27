"use client";

import PdfDocumentViewer from "@/components/lesson/PdfDocumentViewerNoSSR";
import SlidesPreviewCard from "@/components/lesson/SlidesPreviewCard";

type Props = {
  pdfUrl: string | null;
  slidesUrl: string | null;
  coverUrl: string | null;
};

export default function LessonMaterialsClient({
  pdfUrl,
  slidesUrl,
  coverUrl,
}: Props) {
  return (
    <>
      {/* Main Activity PDF - make it “full panel” feel */}
      {pdfUrl ? (
        <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Compact header row */}
          <div className="flex items-center justify-between gap-3 border-b px-4 py-2">
            <div className="text-sm font-semibold text-gray-900">
              Activity document
            </div>
          </div>

          {/* No extra padding around viewer */}
          <div className="px-2 py-2">
            <PdfDocumentViewer url={pdfUrl} />
          </div>
        </div>
      ) : (
        <div className="mt-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-gray-900">
            Activity document
          </div>
          <div className="mt-2 text-sm text-gray-600">
            No document found for this activity.
          </div>
        </div>
      )}

      {/* Slides card (tight spacing) */}
      {slidesUrl ? (
        <div className="mt-3">
          <SlidesPreviewCard
            slidesUrl={slidesUrl}
            coverUrl={coverUrl ?? undefined}
          />
        </div>
      ) : null}
    </>
  );
}

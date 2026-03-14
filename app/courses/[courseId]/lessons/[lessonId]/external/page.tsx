// app/courses/[courseId]/lessons/[lessonId]/external/page.tsx
"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import PdfDocumentViewerNoSSR from "@/components/lesson/PdfDocumentViewerNoSSR";
import { toEmbed } from "@/src/lib/toEmbed";

function isAllowed(url: string) {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();

    const allowedHosts = [
      "docs.google.com",
      "forms.gle",
      "youtube.com",
      "www.youtube.com",
      "youtube-nocookie.com",
      "www.youtube-nocookie.com",
      "youtu.be",
      "vimeo.com",
      "www.vimeo.com",
      "player.vimeo.com",
      "pjjslpdbnwfkvlrxrkpr.supabase.co",
    ];

    return allowedHosts.some(
      (allowed) => host === allowed || host.endsWith(`.${allowed}`)
    );
  } catch {
    return false;
  }
}

export default function ExternalViewerPage() {
  const params = useParams<{ courseId: string; lessonId: string }>();
  const sp = useSearchParams();
  const rawUrl = (sp.get("url") ?? "").trim();

  const backHref = `/courses/${params.courseId}/lessons/${params.lessonId}`;

  if (!rawUrl || !isAllowed(rawUrl)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">External</div>
            <button
              type="button"
              onClick={() => window.location.assign(backHref)}
              className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
            >
              ← Back to activity
            </button>
          </div>

          <div className="mt-6 rounded-xl border bg-white p-5 text-sm text-gray-700">
            Invalid/blocked URL.
          </div>
        </div>
      </div>
    );
  }

  const embedUrl = toEmbed(rawUrl);
  const lowerRaw = rawUrl.toLowerCase();
  const lowerEmbed = embedUrl.toLowerCase();

  const isVideo =
    lowerEmbed.includes("youtube.com/embed/") ||
    lowerEmbed.includes("youtube-nocookie.com/embed/") ||
    lowerEmbed.includes("player.vimeo.com/video/");

  const isPdf = lowerRaw.includes(".pdf");
  const forceIframePdf = lowerRaw.includes("fit-for-55-article.pdf");

  const isForm =
    lowerRaw.includes("docs.google.com/forms") || lowerRaw.includes("forms.gle/");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">
            {isVideo ? "Video" : isPdf ? "Document" : "External resource"}
          </div>

          <button
            type="button"
            onClick={() => window.location.assign(backHref)}
            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
          >
            ← Back to activity
          </button>
        </div>

        {isVideo ? (
          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="aspect-video w-full">
              <iframe
                src={embedUrl}
                className="h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
          </div>

         ) : isPdf ? (
             forceIframePdf ? (
             <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
             <div className="h-[80vh] w-full">
             <iframe
             src={rawUrl}
             title="PDF document"
             className="h-full w-full"
           />
           </div>
          </div>
         ) : (
         <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
           <PdfDocumentViewerNoSSR url={rawUrl} />
         </div>
          )
         ) : isForm ? (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
            <div className="text-sm text-gray-700">
              This form cannot be embedded here (Google blocks it).
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Link
                href="/quizzes/0691176a-40d3-49f7-8b16-6f22274aff03"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Take the quiz
              </Link>

              <button
                type="button"
                onClick={() => window.location.assign(backHref)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
              >
                ← Back to activity
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
            <a
              href={rawUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-blue-700 underline"
            >
              Open resource in new tab
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

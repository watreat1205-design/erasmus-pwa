"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

function isAllowed(url: string) {
  try {
    const u = new URL(url);
    return u.hostname.endsWith("docs.google.com") || u.hostname.endsWith("forms.gle");
  } catch {
    return false;
  }
}

export default function ExternalViewerPage() {
  const params = useParams<{ courseId: string; lessonId: string }>();
  const sp = useSearchParams();
  const url = (sp.get("url") ?? "").trim();

  const backHref = `/my-courses/${params.courseId}/lessons/${params.lessonId}`;

  if (!url || !isAllowed(url)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">External</div>
            <Link href={backHref} className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
              ← Back to activity
            </Link>
          </div>
          <div className="mt-6 rounded-xl border bg-white p-5 text-sm text-gray-700">Invalid/blocked URL.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Quiz (Official Form)</div>
          <Link href={backHref} className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
            ← Back to activity
          </Link>
        </div>

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

    <Link
      href={backHref}
      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
    >
      ← Back to activity
    </Link>
  </div>
</div>

      </div>
    </div>
  );
}

import React from "react";

export default function ActivityLayout({
  title,
  breadcrumbs = "Module → Lesson → Activity",
  backHref = "/my-courses",
  progressPill,
  children,
  sidebar,
}: {
  title: string;
  breadcrumbs?: string;
  backHref?: string;
  progressPill?: React.ReactNode;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="min-w-0">
            <div className="text-xs text-gray-500">{breadcrumbs}</div>
            <h1 className="truncate text-lg font-semibold text-gray-900">{title}</h1>
          </div>

          <div className="flex items-center gap-2">
            {progressPill}
            <a
              href={backHref}
              className="rounded-xl border bg-white px-3 py-2 text-sm hover:bg-gray-50"
            >
              Back
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[1fr_360px]">
        <main className="rounded-2xl border bg-white p-5 shadow-sm">{children}</main>
        {sidebar ? (
          <aside className="lg:sticky lg:top-[72px] lg:h-[calc(100vh-90px)] lg:overflow-auto">
            {sidebar}
          </aside>
        ) : null}
      </div>
    </div>
  );
}

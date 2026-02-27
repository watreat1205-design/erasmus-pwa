"use client";

import { useMemo, useState, useTransition } from "react";
import { bulkSetCoursePublish } from "../actions";
type CourseRow = {
  id: string;
  title: string;
  is_published: boolean;
};

export default function BulkPublishClient({
  courses,
}: {
  courses: CourseRow[];
}) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const selectedIds = useMemo(
    () =>
      Object.entries(selected)
        .filter(([, v]) => v)
        .map(([id]) => id),
    [selected]
  );

  const allSelected =
    courses.length > 0 && selectedIds.length === courses.length;

  function toggleAll() {
    if (allSelected) {
      setSelected({});
      return;
    }
   function clear() {
  setSelected({});
  setMsg(null);
}
    const next: Record<string, boolean> = {};
    courses.forEach((c) => (next[c.id] = true));
    setSelected(next);
  }

  function toggleOne(id: string) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }
  function clearSelection() {
  setSelected({});
  setMsg(null);
   }
  
  

  function runBulk(isPublished: boolean) {
    setMsg(null);

    if (selectedIds.length === 0) {
      setMsg("Select at least one course.");
      return;
    }

    const count = selectedIds.length;

    const ok = confirm(
     `${isPublished ? "Publish" : "Unpublish"} ${count} ${count === 1 ? "course" : "courses"}?`
   );
     if (!ok) return;

    startTransition(async () => {
      const res = await bulkSetCoursePublish(selectedIds, isPublished);
      if (!res.ok) {
        setMsg(res.error ?? "Action failed.");
     } else {
    setMsg(
    `Done: ${isPublished ? "published" : "unpublished"} ${selectedIds.length}.`
   );
     clearSelection();
  }

    });
  }

  return (
    <div className="mt-6">
      {/* Bulk actions */}
      <div className="flex items-center gap-2 rounded-xl border p-4">
        <button
          onClick={() => runBulk(true)}
          disabled={isPending || selectedIds.length === 0}
          className="rounded bg-black px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          Publish selected
        </button>

        <button
          onClick={() => runBulk(false)}
          disabled={isPending || selectedIds.length === 0}
          className="rounded border px-3 py-2 text-sm disabled:opacity-50"
        >
          Unpublish selected
        </button>

        <button
          onClick={clearSelection}
          className="ml-auto text-sm text-gray-600"
        >
          Clear
        </button>

        <span className="text-sm text-gray-600">
          Selected: {selectedIds.length}
        </span>
      </div>

      {msg && <p className="mt-3 text-sm">{msg}</p>}

      {/* Table */}
      <div className="mt-4 rounded-xl border">
        <div className="grid grid-cols-[48px_1fr_140px] border-b bg-gray-50 px-4 py-2 text-sm font-medium">
          <input type="checkbox" checked={allSelected} onChange={toggleAll} />
          <div>Course</div>
          <div>Status</div>
        </div>

        {courses.map((c) => (
          <div
            key={c.id}
            className="grid grid-cols-[48px_1fr_140px] items-center px-4 py-2 text-sm hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={!!selected[c.id]}
              onChange={() => toggleOne(c.id)}
            />

            <div>{c.title}</div>

            <div>
              {c.is_published ? (
                <span className="text-green-700">Published</span>
              ) : (
                <span className="text-gray-500">Draft</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

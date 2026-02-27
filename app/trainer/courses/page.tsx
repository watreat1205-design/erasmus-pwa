import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { setCoursePublished } from "./actions";

type CourseLite = {
  id: string;
  title: string;
  is_published: boolean;
};

function normalizeCourses(value: unknown): CourseLite[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((c) => {
      if (!c || typeof c !== "object") return null;
      const r = c as Record<string, unknown>;
      const id = typeof r.id === "string" ? r.id : null;
      const title = typeof r.title === "string" ? r.title : "Course";
      const is_published = typeof r.is_published === "boolean" ? r.is_published : false;
      if (!id) return null;
      return { id, title, is_published };
    })
    .filter((x): x is CourseLite => x !== null);
}

export default async function TrainerCoursesPage() {
  const supabase = await createSupabaseServerClient();

  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, title, is_published, updated_at")
    .order("updated_at", { ascending: false });
 
 const courseList = normalizeCourses(courses);

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Link href="/dashboard" style={{ display: "inline-block", marginBottom: 16 }}>
          ← Back to dashboard
        </Link>

        <h2>Trainer / Courses</h2>
        <p style={{ color: "crimson" }}>{error.message}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Link
         href="/dashboard"
         className="inline-block rounded border px-3 py-2 text-sm"
     >
        ← Back to dashboard
       </Link>

        <h2>Trainer / Courses</h2>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/trainer/courses/new">+ New course</Link>
        </div>
      </div>

      {!courses?.length ? (
        <p>No courses yet.</p>
      ) : (
        <ul style={{ marginTop: 16 }}>
          {courseList.map((c) => { 
            const courseId = String(c.id ?? "");
            const href = `/trainer/courses/${courseId}/edit`;
            const published = Boolean(c.is_published);

            return (
              <li
                key={courseId || c.title}
                style={{
                  padding: 12,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{c.title}</div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>
                      {published ? "Published" : "Draft"} — id: {courseId || "MISSING"}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>link: {href}</div>
                  </div>

                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    {/* Publish / Unpublish (DEV only via RPC policy) */}
                    {courseId ? (
                      <form
                        action={async () => {
                          "use server";
                          await setCoursePublished(courseId, !published);
                        }}
                      >
                        <button
                          type="submit"
                          style={{
                            padding: "6px 10px",
                            borderRadius: 8,
                            border: published ? "1px solid #ddd" : "1px solid #16a34a",
                            background: published ? "#fff" : "#16a34a",
                            color: published ? "#111" : "#fff",
                            cursor: "pointer",
                          }}
                        >
                          {published ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                    ) : (
                      <span style={{ color: "crimson" }}>Missing id</span>
                    )}

                    {courseId ? <Link href={href}>Edit</Link> : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  addLesson,
  addSection,
  updateCourse,
  deleteLesson,
  enrollByEmail,
  unenroll,
  updateLessonContent,
  setLessonPublished,
  bulkSetLessonsPublished,
} from "../../actions";

type LessonRow = {
  id: string;
  section_id: string;
  title: string;
  position: number;
  is_published: boolean;
  content: string | null;
};

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: courseId } = await params;

  if (!courseId) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Edit course</h2>
        <p style={{ color: "crimson" }}>
          Missing course id in URL. Go back and click Edit again.
        </p>
        <Link href="/trainer/courses">← Back</Link>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();

  // Course
  const { data: course, error: courseErr } = await supabase
    .from("courses")
    .select("id, title, description, is_published")
    .eq("id", courseId)
    .single();

  if (courseErr || !course) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Edit course</h2>
        <p style={{ color: "crimson" }}>{courseErr?.message ?? "Not found"}</p>
        <Link href="/trainer/courses">← Back</Link>
      </div>
    );
  }

  // Enrollments
  const { data: enrollments, error: enrErr } = await supabase
    .from("course_enrollments")
    .select("user_id, enrolled_at")
    .eq("course_id", courseId)
    .order("enrolled_at", { ascending: false });

  if (enrErr) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Edit course</h2>
        <p style={{ color: "crimson" }}>{enrErr.message}</p>
        <Link href="/trainer/courses">← Back</Link>
      </div>
    );
  }

  // Sections
  const { data: sections, error: secErr } = await supabase
    .from("course_sections")
    .select("id, title, position")
    .eq("course_id", courseId)
    .order("position", { ascending: true });

  if (secErr) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Edit course</h2>
        <p style={{ color: "crimson" }}>{secErr.message}</p>
        <Link href="/trainer/courses">← Back</Link>
      </div>
    );
  }

  const sectionIds = (sections ?? []).map((s) => s.id);

  // (Optional) for bulk actions / sanity checks
  const { data: lessonsForCourse, error: bulkErr } = sectionIds.length
    ? await supabase
        .from("course_lessons")
        .select("id, is_published")
        .in("section_id", sectionIds)
    : { data: [], error: null };

  if (bulkErr) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Edit course</h2>
        <p style={{ color: "crimson" }}>{bulkErr.message}</p>
        <Link href="/trainer/courses">← Back</Link>
      </div>
    );
  }

  // Lessons for all sections
  const { data: lessons, error: lesErr } = sectionIds.length
    ? await supabase
        .from("course_lessons")
        .select("id, section_id, title, position, content, is_published")
        .in("section_id", sectionIds)
        .order("position", { ascending: true })
    : { data: [], error: null };

  if (lesErr) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Edit course</h2>
        <p style={{ color: "crimson" }}>{lesErr.message}</p>
        <Link href="/trainer/courses">← Back</Link>
      </div>
    );
  }

  const lessonRows = (lessons ?? []) as LessonRow[];

  const lessonsBySection = new Map<string, LessonRow[]>();
  for (const l of lessonRows) {
    const arr = lessonsBySection.get(l.section_id) ?? [];
    arr.push(l);
    lessonsBySection.set(l.section_id, arr);
  }

  return (
    <div style={{ padding: 24, maxWidth: 950 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Edit Course</h2>
        <Link href="/trainer/courses">← Back to courses</Link>
      </div>

      {/* Course form */}
      <form
        action={updateCourse.bind(null, courseId)}
        style={{
          display: "grid",
          gap: 12,
          marginTop: 16,
          padding: 16,
          border: "1px solid #ddd",
          borderRadius: 10,
        }}
      >
        <label>
          Title
          <input
            name="title"
            defaultValue={course.title ?? ""}
            placeholder="Course title"
            required
            style={{ width: "100%", padding: 10 }}
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            defaultValue={course.description ?? ""}
            style={{ width: "100%", padding: 10 }}
          />
        </label>

        <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            name="is_published"
            type="checkbox"
            defaultChecked={!!course.is_published}
          />
          Published
        </label>

        <button type="submit" style={{ padding: 12 }}>
          Save course
        </button>
      </form>

      {/* Learner enrollments */}
      <div
        style={{
          marginTop: 18,
          padding: 16,
          border: "1px solid #ddd",
          borderRadius: 10,
        }}
      >
        <h3 style={{ marginTop: 0 }}>Learner enrollments</h3>

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <form action={bulkSetLessonsPublished}>
            <input type="hidden" name="courseId" value={courseId} />
            <input type="hidden" name="publish" value="true" />
            <button type="submit" style={{ padding: "10px 14px" }}>
              Publish ALL lessons
            </button>
          </form>

          <form action={bulkSetLessonsPublished}>
            <input type="hidden" name="courseId" value={courseId} />
            <input type="hidden" name="publish" value="false" />
            <button type="submit" style={{ padding: "10px 14px" }}>
              Unpublish ALL lessons
            </button>
          </form>
        </div>

        <form
          action={enrollByEmail.bind(null, courseId)}
          style={{ display: "flex", gap: 10, marginTop: 10 }}
        >
          <input
            name="email"
            placeholder="Learner email (must already have an account)"
            required
            style={{ flex: 1, padding: 10 }}
          />
          <button type="submit" style={{ padding: "10px 14px" }}>
            Enroll
          </button>
        </form>

        <div style={{ marginTop: 12, fontSize: 13, opacity: 0.8 }}>
          Enrolled users: {enrollments?.length ?? 0}
        </div>

        {!enrollments?.length ? (
          <p style={{ marginTop: 10, opacity: 0.75 }}>No enrollments yet.</p>
        ) : (
          <ul style={{ marginTop: 10 }}>
            {enrollments.map((e) => (
              <li key={e.user_id} style={{ marginBottom: 6 }}>
                <span style={{ fontFamily: "monospace" }}>{e.user_id}</span>{" "}
                <span style={{ opacity: 0.7 }}>
                  ({new Date(e.enrolled_at).toLocaleString()})
                </span>
                <form
                  action={unenroll.bind(null, courseId, e.user_id)}
                  style={{ display: "inline", marginLeft: 10 }}
                >
                  <button
                    type="submit"
                    style={{
                      color: "crimson",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Sections */}
      <div style={{ marginTop: 24 }}>
        <h3>Sections</h3>

        <form
          action={addSection.bind(null, courseId)}
          style={{ display: "flex", gap: 10, marginTop: 10 }}
        >
          <input
            name="title"
            placeholder="New section title"
            required
            style={{ flex: 1, padding: 10 }}
          />
          <button type="submit" style={{ padding: "10px 14px" }}>
            Add section
          </button>
        </form>

        {!sections?.length ? (
          <p style={{ marginTop: 12 }}>No sections yet.</p>
        ) : (
          <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
            {sections.map((s) => (
              <div
                key={s.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  padding: 14,
                }}
              >
                <div style={{ fontWeight: 700 }}>
                  {s.position}. {s.title}
                </div>

                <div style={{ marginTop: 10, paddingLeft: 10 }}>
                  <div style={{ fontSize: 13, opacity: 0.7 }}>Lessons</div>

                  <ul style={{ marginTop: 8 }}>
                    {(lessonsBySection.get(s.id) ?? []).map((l, lIndex) => (
                      <li key={l.id} style={{ marginBottom: 10 }}>
                        {lIndex + 1}. {l.title}
                        <span
                          style={{
                            marginLeft: 8,
                            padding: "2px 8px",
                            fontSize: 12,
                            borderRadius: 999,
                            background: l.is_published ? "#dcfce7" : "#f3f4f6",
                            color: l.is_published ? "#166534" : "#4b5563",
                            border: "1px solid",
                            borderColor: l.is_published ? "#86efac" : "#d1d5db",
                            verticalAlign: "middle",
                            display: "inline-block",
                            marginTop: 0,
                          }}
                        >
                          {l.is_published ? "Published" : "Draft"}
                        </span>

                        <form
                          action={setLessonPublished}
                          style={{ display: "inline", marginLeft: 10 }}
                        >
                          <input type="hidden" name="courseId" value={courseId} />
                          <input type="hidden" name="lessonId" value={l.id} />
                          <input
                            type="hidden"
                            name="publish"
                            value={l.is_published ? "false" : "true"}
                          />
                          <button
                            type="submit"
                            style={{
                              color: l.is_published ? "#b45309" : "#15803d",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            {l.is_published ? "Unpublish" : "Publish"}
                          </button>
                        </form>

                        <form
                          action={deleteLesson.bind(null, l.id)}
                          style={{ display: "inline", marginLeft: 10 }}
                        >
                          <button
                            type="submit"
                            style={{
                              color: "crimson",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            Delete
                          </button>
                        </form>

                        <form
                          action={updateLessonContent.bind(null, l.id)}
                          style={{ marginTop: 8, display: "grid", gap: 6 }}
                        >
                          <textarea
                            name="content"
                            defaultValue={l.content ?? ""}
                            placeholder="Lesson content..."
                            rows={4}
                            style={{
                              width: "100%",
                              padding: 10,
                              border: "1px solid #ddd",
                              borderRadius: 8,
                              outline: "none",
                            }}
                          />
                          <button
                            type="submit"
                            style={{ width: "fit-content", padding: "8px 12px" }}
                          >
                            Save content
                          </button>
                        </form>
                      </li>
                    ))}
                  </ul>

                  <form
                    action={addLesson.bind(null, s.id)}
                    style={{ display: "flex", gap: 10, marginTop: 10 }}
                  >
                    <input
                      name="title"
                      placeholder="New lesson title"
                      required
                      style={{ flex: 1, padding: 10 }}
                    />
                    <button type="submit" style={{ padding: "10px 14px" }}>
                      Add lesson
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* (Optional) keep variable referenced so TS doesn't warn in strict configs */}
      <div style={{ display: "none" }}>{(lessonsForCourse ?? []).length}</div>
    </div>
  );
}

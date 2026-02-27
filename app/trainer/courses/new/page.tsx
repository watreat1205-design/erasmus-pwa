// app/trainer/courses/new/page.tsx
import Link from "next/link";
import { createCourse } from "../actions";

export default function NewCoursePage() {
  return (
    <div style={{ padding: 24, maxWidth: 700 }}>
      <h2>New Course</h2>

      <form action={createCourse} style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <label>
          Title
          <input name="title" placeholder="e.g. Sustainability Basics" style={{ width: "100%", padding: 10 }} />
        </label>

        <label>
          Description
          <textarea name="description" placeholder="Short description..." style={{ width: "100%", padding: 10 }} />
        </label>

        <button type="submit" style={{ padding: 12 }}>
          Create
        </button>
      </form>

      <div style={{ marginTop: 16 }}>
        <Link href="/trainer/courses">← Back</Link>
      </div>
    </div>
  );
}

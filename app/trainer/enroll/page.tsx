import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { enroll } from "./actions";

export default async function EnrollPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "trainer") redirect("/dashboard");

  const { data: courses } = await supabase.from("courses").select("id,title").order("created_at", { ascending: false });
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("user_id, course_id, enrolled_at")
    .order("enrolled_at", { ascending: false })
    .limit(20);

  return (
    <main style={{ padding: 24, maxWidth: 700 }}>
      <h1>Trainer • Enroll Learner</h1>

      <form action={enroll} style={{ marginTop: 16, display: "grid", gap: 10 }}>
        <input name="user_id" placeholder="Learner user_id (uuid)" required style={{ padding: 10 }} />
        <select name="course_id" required style={{ padding: 10 }}>
          <option value="">Select course…</option>
          {(courses ?? []).map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <button type="submit" style={{ padding: 10 }}>Enroll</button>
      </form>

      <h2 style={{ marginTop: 28 }}>Recent enrollments</h2>
      <ul style={{ marginTop: 10 }}>
        {(enrollments ?? []).map((e, idx) => (
          <li key={idx} style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8, marginBottom: 8 }}>
            <div><b>user_id:</b> {e.user_id}</div>
            <div><b>course_id:</b> {e.course_id}</div>
            <div style={{ opacity: 0.8 }}>{e.enrolled_at}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}

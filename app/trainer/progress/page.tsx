import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function TrainerProgressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "trainer") redirect("/dashboard");

  return (
    <main style={{ padding: 24 }}>
      <h1>Learner Progress</h1>
      <p>Coming next: progress tables, quiz results, completion %.</p>
    </main>
  );
}

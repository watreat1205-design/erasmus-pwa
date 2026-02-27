import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function TrainerPage() {
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
      <h1>Trainer Panel</h1>
      <p>Coming next: course builder, uploads, and learner management.</p>
    </main>
  );
}

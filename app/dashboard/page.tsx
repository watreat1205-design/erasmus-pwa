// app/dashboard/page.tsx
import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/getRole";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  noStore();

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName = user?.email ?? "User";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();

    const full = profile?.full_name?.trim();
    if (full) displayName = full.split(/\s+/)[0];
  }

  const role = await getCurrentUserRole();

  const cards = [
    {
      titleKey: "dashboard.cards.myCourses.title",
      descKey: "dashboard.cards.myCourses.desc",
      href: "/courses",
    },
    {
      titleKey: "dashboard.cards.certificates.title",
      descKey: "dashboard.cards.certificates.desc",
      href: "/certificates",
    },
    {
      titleKey: "dashboard.cards.quizzes.title",
      descKey: "dashboard.cards.quizzes.desc",
      href: "/quizzes",
    },
    {
      titleKey: "dashboard.cards.profile.title",
      descKey: "dashboard.cards.profile.desc",
      href: "/profile",
    },
    {
      titleKey: "dashboard.cards.support.title",
      descKey: "dashboard.cards.support.desc",
      href: "/support",
    },
    {
      titleKey: "dashboard.cards.settings.title",
      descKey: "dashboard.cards.settings.desc",
      href: "/settings",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-y-auto">
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: "url(/templates/5.jpg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center top",
        }}
      />

      <div className="fixed inset-0 -z-10 bg-black/20" />

      <div className="relative">
        <DashboardClient
          displayName={displayName}
          cards={cards}
          isDev={role === "dev"}
        />
      </div>
    </div>
  );
}

import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/getRole";
import bgTemplate5 from "../../Templates/5.jpg";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Default fallback
  let displayName = user?.email ?? "User";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    const full = profile?.full_name?.trim();
    if (full) displayName = full.split(/\s+/)[0];
  }

  const role = await getCurrentUserRole();

  const cards = [
    {
      titleKey: "dashboard.cards.myCourses.title",
      descKey: "dashboard.cards.myCourses.desc",
      href: "/courses", // change to "/my-courses" if that is the intended page
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
      {/* Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${bgTemplate5.src})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center -410px",
        }}
      />

      {/* Overlay */}
      <div className="fixed inset-0 -z-10 bg-black/20" />

      {/* Page content */}
      <div className="relative">
        <DashboardClient displayName={displayName} cards={cards} isDev={role === "dev"} />
      </div>
    </div>
  );
}

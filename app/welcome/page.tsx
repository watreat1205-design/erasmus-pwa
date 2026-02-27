// app/welcome/page.tsx
import Image from "next/image";
import bgTemplate5 from "../../Templates/8.jpg";
import { getMyProfile } from "../../src/lib/auth/getProfile";
import WelcomeClient from "./WelcomeClient";
import { getNgoInviteMeta } from "./server";

export const dynamic = "force-dynamic";

const SUPPORTED = new Set(["en", "el", "it", "es", "ro", "hr"]);

export default async function WelcomePage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string; invite?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const initialLang = SUPPORTED.has(sp.lang ?? "") ? (sp.lang as string) : "en";

  const inviteToken = (sp.invite ?? "").trim() || null;

  const profile = await getMyProfile().catch(() => null);
  const loggedIn = !!profile;

  const displayName =
    (profile?.full_name || profile?.email || "").toString().trim() || null;

  // Prefetch invite info (NGO name, role, etc.) to render a nicer welcome screen
  const inviteMeta = inviteToken
    ? await getNgoInviteMeta(inviteToken).catch(() => null)
    : null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Image
        src={bgTemplate5}
        alt=""
        fill
        priority
        className="object-cover object-[center_55%]"
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 sm:px-6">
        <WelcomeClient
          loggedIn={loggedIn}
          displayName={displayName}
          initialLang={initialLang}
          inviteToken={inviteToken}
          inviteMeta={inviteMeta}
        />
      </div>
    </div>
  );
}

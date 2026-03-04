// app/welcome/page.tsx
import Image from "next/image";
import { cookies } from "next/headers";
import bgTemplate5 from "../../Templates/8.jpg";
import { getMyProfile } from "../../src/lib/auth/getProfile";
import WelcomeClient from "./WelcomeClient";

export const dynamic = "force-dynamic";

const SUPPORTED = new Set(["en", "el", "it", "es", "ro", "hr"]);

async function getLangFromCookie() {
  const c = await cookies();

  const raw =
    c.get("i18nextLng")?.value ||
    c.get("i18next")?.value ||
    c.get("lng")?.value ||
    c.get("NEXT_LOCALE")?.value ||
    "en";

  const short = raw.split("-")[0];
  return SUPPORTED.has(short) ? short : "en";
}

export default async function WelcomePage({
  searchParams,
}: {
  searchParams?: Promise<{ invite?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const initialLang = await getLangFromCookie();

  const profile = await getMyProfile().catch(() => null);
  const loggedIn = !!profile;

  const displayName =
    (profile?.full_name || profile?.email || "").toString().trim() || null;

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
        />
      </div>
    </div>
  );
}

// app/welcome/page.tsx
import Image from "next/image";
import { cookies } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import WelcomeClient from "./WelcomeClient";
import FooterPartners from "@/components/layout/FooterPartners";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  noStore();

  const sp = (await searchParams) ?? {};
  const initialLang = await getLangFromCookie();

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .maybeSingle();

    displayName =
      (profile?.full_name ||
        profile?.email ||
        user.user_metadata?.full_name ||
        user.email ||
        "")
        .toString()
        .trim() || null;
  }

  const loggedIn = !!user;

  return (
  <div className="relative min-h-[118vh] overflow-hidden">
    <Image
      src="/templates/8.jpg"
      alt=""
      fill
      priority
      className="object-cover object-[center_55%]"
    />
    <div className="absolute inset-0 bg-black/20" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />

    <div className="relative mx-auto flex min-h-[118vh] max-w-6xl flex-col px-4 sm:px-6">
      <div className="pt-0">
        <WelcomeClient
          loggedIn={loggedIn}
          displayName={displayName}
          initialLang={initialLang}
        />
      </div>

      <div className="mt-auto pb-6">
        <FooterPartners compact />

        <div className="-mt-px mx-auto max-w-6xl px-4">
          <div className="rounded-b-[28px] border border-white/20 border-t-0 bg-white/10 px-4 py-3 text-center backdrop-blur-xl shadow-xl">
            <p className="text-xs text-white/80">
              Developed by{" "}
              <span className="font-medium text-white">
                Andreas Aristodemou
              </span>
            </p>
            <p className="text-xs">
              <a
                href="mailto:aristodemou.a1@gmail.com"
                className="text-blue-200 hover:underline"
              >
                aristodemou.a1@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

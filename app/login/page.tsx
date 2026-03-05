import Image from "next/image";
import LoginClient from "./LoginClient";

export default async function LoginPage({ searchParams }: { searchParams: Promise<any> }) {
  const sp = await searchParams;

  const inviteToken = (sp?.invite ?? "").trim() || null;
  const lang = (sp?.lang ?? "").trim() || null;

  const nextParam = sp?.next;
  const raw =
    typeof nextParam === "string"
      ? nextParam
      : Array.isArray(nextParam)
      ? nextParam[0]
      : "/welcome";

  const safeBase = raw.startsWith("/") ? raw : "/welcome";

  const params = new URLSearchParams();
  if (inviteToken) params.set("invite", inviteToken);
  if (lang) params.set("lang", lang);
  const qs = params.toString();

  const nextUrl =
    qs.length > 0 ? `${safeBase}${safeBase.includes("?") ? "&" : "?"}${qs}` : safeBase;

  const signupHref = qs.length > 0 ? `/signup?${qs}` : "/signup";
  const welcomeHref = qs.length > 0 ? `/welcome?${qs}` : "/welcome";
  const resetHref = qs.length > 0 ? `/reset-password?${qs}` : "/reset-password";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6 py-10">
      <div className="relative w-full max-w-xl min-h-[85vh] overflow-hidden rounded-2xl shadow-2xl border border-black/10">
        <Image src="/templates/3b.jpg" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 min-h-[85vh] flex items-center justify-center px-5 py-10">
          <LoginClient
            nextUrl={nextUrl}
            signupHref={signupHref}
            welcomeHref={welcomeHref}
            resetHref={resetHref}
            inviteToken={inviteToken}
          />
        </div>
      </div>
    </div>
  );
}

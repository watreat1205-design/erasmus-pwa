// app/welcome/actions.ts
"use server";

import { getMyProfile } from "../../src/lib/auth/getProfile";
import { redirect } from "next/navigation";

export async function acceptNgoInvite(inviteToken: string) {
  const profile = await getMyProfile().catch(() => null);
  if (!profile) {
    // Not logged in yet — just bounce to auth and come back
    redirect(`/auth?next=${encodeURIComponent(`/welcome?invite=${inviteToken}`)}`);
  }

  // Replace with your real accept-invite endpoint
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ngo-invite/accept`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ inviteToken }),
    cache: "no-store",
  });

  if (!res.ok) {
    // You can redirect to an error screen or return a structured error for client UI
    throw new Error("Invite acceptance failed");
  }

  const data = await res.json();
  // expected: { ngoSlug: "foo", nextPath?: "/ngo/foo/onboarding" }
  redirect(data.nextPath ?? `/ngo/${data.ngoSlug}`);
}

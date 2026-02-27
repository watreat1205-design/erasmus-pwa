// app/welcome/server.ts
import "server-only";

export type NgoInviteMeta = {
  ngoId: string;
  ngoName: string;
  role?: string; // e.g. "volunteer", "member", etc.
  expiresAt?: string;
};

// Replace with your real backend call / DB query.
export async function getNgoInviteMeta(inviteToken: string): Promise<NgoInviteMeta> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ngo-invite/meta`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ inviteToken }),
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Invite meta fetch failed");
  return res.json();
}

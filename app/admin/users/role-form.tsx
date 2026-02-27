"use client";

import { useState } from "react";
import type { UserRole } from "@/lib/auth/roles";
import { setUserRoleAction } from "./set-role-action";

export default function RoleForm({
  targetUserId,
  currentRole,
}: {
  targetUserId: string;
  currentRole: UserRole | null | undefined;
}) {
  const initialRole: UserRole = (currentRole ?? "trainer") as UserRole;

  const [role, setRole] = useState<UserRole>(initialRole);
  const [msg, setMsg] = useState<string>("");

  async function onSave() {
    setMsg("");
    const res = await setUserRoleAction(targetUserId, role);
    setMsg(res.ok ? "Saved ✅" : `Error: ${res.error}`);
  }

  return (
    <div className="flex items-center gap-3">
      <select
        className="rounded-lg border px-3 py-2"
        value={role}
        onChange={(e) => setRole(e.target.value as UserRole)}
      >
        <option value="trainer">trainer</option>
        <option value="learner">learner</option>
        <option value="dev">dev</option>
      </select>

      <button
        type="button"
        className="rounded-lg bg-black px-3 py-2 text-white"
        onClick={onSave}
      >
        Save role
      </button>

      {msg && <span className="text-sm text-gray-700">{msg}</span>}
    </div>
  );
}

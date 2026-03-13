// src/lib/auth/roles.ts
export type UserRole = "trainer" | "admin" | "dev";

export const Role = {
  Trainer: "trainer",
  Admin: "admin",
  Dev: "dev",
} as const;

export function hasAnyRole(
  role: UserRole | null | undefined,
  allowed: UserRole[]
) {
  if (!role) return false;
  return allowed.includes(role);
}

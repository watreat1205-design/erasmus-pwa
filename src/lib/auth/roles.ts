export type UserRole = "learner" | "trainer" | "admin_ro" | "dev";

export const Role = {
  Learner: "learner",
  Trainer: "trainer",
  AdminRO: "admin_ro",
  Dev: "dev",
} as const;

export function hasAnyRole(
  role: UserRole | null | undefined,
  allowed: UserRole[]
) {
  if (!role) return false;
  return allowed.includes(role);
}

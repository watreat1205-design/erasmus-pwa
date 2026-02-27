import type { UserRole } from "@/lib/auth/roles";

export const canViewAdmin = (role: UserRole) =>
  role === "dev" || role === "admin_ro";

export const canAuthorContent = (role: UserRole) => role === "dev";

export const canLearn = (role: UserRole) =>
  role === "dev" || role === "admin_ro" || role === "trainer" || role === "learner";


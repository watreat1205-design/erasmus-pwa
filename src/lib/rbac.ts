// src/lib/rbac.ts
import type { UserRole } from "@/lib/auth/roles";

export const canViewAdmin = (role: UserRole) =>
  role === "dev" || role === "admin";

export const canAuthorContent = (role: UserRole) => role === "dev";

export const canLearn = (role: UserRole) =>
  role === "dev" || role === "admin" || role === "trainer";

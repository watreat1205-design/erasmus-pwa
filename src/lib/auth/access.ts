// src/lib/auth/access.ts
import type { UserRole } from "./roles";

export const ACCESS: Record<string, UserRole[]> = {
  "/courses": ["trainer", "admin", "dev"],
  "/courses/": ["trainer", "admin", "dev"],

  "/admin": ["admin", "dev"],
  "/admin/": ["admin", "dev"],

  "/author": ["dev"],
  "/author/": ["dev"],

  "/trainer": ["dev"],
  "/trainer/": ["dev"],
};

import type { UserRole } from "./roles";

export const ACCESS: Record<string, UserRole[]> = {
  "/courses": ["learner", "trainer", "admin_ro", "dev"],
  "/courses/": ["learner", "trainer", "admin_ro", "dev"],

  "/admin": ["admin_ro", "dev"],
  "/admin/": ["admin_ro", "dev"],

  "/author": ["dev"],
  "/author/": ["dev"],

  "/trainer": ["dev"],
  "/trainer/": ["dev"],
};

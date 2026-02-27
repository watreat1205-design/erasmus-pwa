import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getActivityFiles(
  courseSlug: string,
  module: string,
  activity: string
) {
  const supabase = await createSupabaseServerClient();

  const path = `${courseSlug}/${module}/${activity}`;

  const { data, error } = await supabase.storage
    .from("course-assets")
    .list(path, { limit: 100 });

  if (error) {
    console.error("Storage error:", error);
    return [];
  }

  return data ?? [];
}

